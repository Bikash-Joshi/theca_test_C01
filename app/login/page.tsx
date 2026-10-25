"use client";

import { Suspense, useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createClient } from "@/lib/supabase/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const brandSx = {
  fontWeight: 600,
  letterSpacing: "0.19em",
  color: "inherit",
  textDecoration: "none",
} as const;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();
  const [error, setError] = useState(
    params.get("error") === "confirmation_failed"
      ? "That confirmation link is invalid or has expired."
      : "",
  );
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setInfo("");
    const form = new FormData(event.currentTarget);
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  const handleForgot = async (email: string) => {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    const { error } = await createClient().auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/auth/callback` },
    );
    if (error) setError(error.message);
    else setInfo("If that email has an account, a reset link is on its way.");
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
      }}
    >
      {/* Brand visual */}
      <Box
        component="section"
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "common.white",
          backgroundImage:
            "linear-gradient(180deg, rgba(20,19,17,.55), rgba(20,19,17,.35)), url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography component={NextLink} href="/" sx={brandSx}>
          MAISON ÉLAN
        </Typography>

        <Box>
          <Typography variant="overline" sx={{ opacity: 0.85 }}>
            THE ART OF LESS
          </Typography>
          <Typography variant="h1" sx={{ fontSize: 72, my: 2 }}>
            Elegance
            <br />
            is a way
            <br />
            <Box component="span" sx={{ fontStyle: "italic" }}>
              of life.
            </Box>
          </Typography>
          <Typography sx={{ maxWidth: 380, opacity: 0.85 }}>
            Discover a world shaped by thoughtful design and timeless
            sophistication.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ letterSpacing: "0.2em", opacity: 0.75 }}>
          TIMELESS BY DESIGN
        </Typography>
      </Box>

      {/* Form panel */}
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: { xs: 3, md: 6 },
          bgcolor: "background.default",
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            component={NextLink}
            href="/"
            sx={{ ...brandSx, display: { xs: "block", md: "none" } }}
          >
            MAISON ÉLAN
          </Typography>
          <Button
            component={NextLink}
            href="/"
            color="inherit"
            size="small"
            startIcon={<ArrowBackIcon />}
            sx={{ ml: "auto" }}
          >
            Back to home
          </Button>
        </Stack>

        <Box sx={{ m: "auto", width: "100%", maxWidth: 420, py: 6 }}>
          <Typography variant="overline" color="text.secondary">
            WELCOME BACK
          </Typography>
          <Typography variant="h2" sx={{ fontSize: 40, mt: 1, mb: 1.5 }}>
            Sign in to your account.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Your personal space awaits.
          </Typography>

          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit}
          >
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <Box>
              <TextField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    const form = e.currentTarget.closest("form");
                    handleForgot(
                      String(new FormData(form as HTMLFormElement).get("email") ?? ""),
                    );
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 0 }}>
                {error}
              </Alert>
            )}
            {info && (
              <Alert severity="info" sx={{ borderRadius: 0 }}>
                {info}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={<ArrowOutwardIcon />}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </Stack>

          <Divider sx={{ my: 4, typography: "caption", letterSpacing: "0.2em" }}>
            NEW HERE?
          </Divider>

          <Button
            component={NextLink}
            href="/signup"
            variant="outlined"
            fullWidth
            size="large"
          >
            Create an account
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            A more personal experience, thoughtfully curated.
          </Typography>
        </Box>

        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", color: "text.secondary" }}
        >
          <Typography variant="caption">© 2026 MAISON ÉLAN</Typography>
          <Typography variant="caption">PRIVACY · TERMS</Typography>
        </Stack>
      </Box>
    </Box>
  );
}


export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
