import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/authApi";
import { clearStoredToken, hasStoredToken, setStoredToken } from "../api/http";
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "loading" }
  | { type: "success"; user: AuthUser }
  | { type: "error"; message: string }
  | { type: "logout" };

interface AuthContextValue extends AuthState {
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };
    case "success":
      return { user: action.user, loading: false, error: null };
    case "error":
      return { ...state, loading: false, error: action.message };
    case "logout":
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  loading: hasStoredToken(),
  error: null
};

const persistAuth = (response: AuthResponse): AuthUser => {
  setStoredToken(response.token);
  return response.user;
};

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Something went wrong";
};

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let active = true;

    const loadUser = async (): Promise<void> => {
      if (!hasStoredToken()) {
        return;
      }

      try {
        const user = await getCurrentUser();
        if (active) {
          dispatch({ type: "success", user });
        }
      } catch {
        clearStoredToken();
        if (active) {
          dispatch({ type: "logout" });
        }
      }
    };

    void loadUser();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<void> => {
    dispatch({ type: "loading" });

    try {
      const response = await loginUser(input);
      dispatch({ type: "success", user: persistAuth(response) });
    } catch (error) {
      dispatch({ type: "error", message: getErrorMessage(error) });
      throw error;
    }
  }, []);

  const register = useCallback(async (input: RegisterInput): Promise<void> => {
    dispatch({ type: "loading" });

    try {
      const response = await registerUser(input);
      dispatch({ type: "success", user: persistAuth(response) });
    } catch (error) {
      dispatch({ type: "error", message: getErrorMessage(error) });
      throw error;
    }
  }, []);

  const logout = useCallback((): void => {
    clearStoredToken();
    dispatch({ type: "logout" });
  }, []);

  const clearError = useCallback((): void => {
    if (state.user) {
      dispatch({ type: "success", user: state.user });
    } else {
      dispatch({ type: "logout" });
    }
  }, [state.user]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError
    }),
    [clearError, login, logout, register, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
