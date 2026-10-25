"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createClient } from "@/lib/supabase/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const brandSx = {
  fontWeight: 600,
  letterSpacing: "0.19em",
  color: "inherit",
  textDecoration: "none",
} as const;

type Fields = {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

function validate({ name, email, password, address, phone }: Fields): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
    errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8)
    errors.password = "Use at least 8 characters";
  if (!address.trim()) errors.address = "Address is required";
  if (!phone.trim()) errors.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-()]{7,20}$/.test(phone.trim()))
    errors.phone = "Enter a valid phone number";
  return errors;
}

export default function SignupPage() {
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const handleChange =
    (field: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: event.target.value }));
      if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          name: values.name.trim(),
          address: values.address.trim(),
          phone: values.phone.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    // With email confirmation enabled there is no session until the link is clicked.
    if (data.session) {
      router.push("/account");
      router.refresh();
    } else {
      setNeedsConfirmation(true);
      setSubmitted(true);
    }
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
            "linear-gradient(180deg, rgba(20,19,17,.55), rgba(20,19,17,.35)), url(https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography component={NextLink} href="/" sx={brandSx}>
          MAISON ÉLAN
        </Typography>

        <Box>
          <Typography variant="overline" sx={{ opacity: 0.85 }}>
            JOIN THE HOUSE
          </Typography>
          <Typography variant="h1" sx={{ fontSize: 72, my: 2 }}>
            Begin
            <br />
            your{" "}
            <Box component="span" sx={{ fontStyle: "italic" }}>
              journey.
            </Box>
          </Typography>
          <Typography sx={{ maxWidth: 380, opacity: 0.85 }}>
            Create your account to explore the collection, thoughtfully curated
            and delivered to your door.
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ letterSpacing: "0.2em", opacity: 0.75 }}
        >
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
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
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
          {submitted ? (
            <Box>
              <Typography variant="overline" color="text.secondary">
                WELCOME
              </Typography>
              <Typography variant="h2" sx={{ fontSize: 40, mt: 1, mb: 1.5 }}>
                Thank you, {values.name.trim().split(/\s+/)[0]}.
              </Typography>
              <Alert severity="success" sx={{ my: 3, borderRadius: 0 }}>
                {needsConfirmation
                  ? `Your account has been created. Check ${values.email.trim()} for a confirmation link, then sign in.`
                  : "Your account has been created."}
              </Alert>
              <Button
                component={NextLink}
                href="/login"
                variant="contained"
                size="large"
                endIcon={<ArrowOutwardIcon />}
              >
                Go to sign in
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="overline" color="text.secondary">
                CREATE YOUR ACCOUNT
              </Typography>
              <Typography variant="h2" sx={{ fontSize: 40, mt: 1, mb: 1.5 }}>
                Sign up.
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Tell us a little about yourself. All fields are required.
              </Typography>

              <Stack
                component="form"
                noValidate
                spacing={3}
                onSubmit={handleSubmit}
              >
                <TextField
                  id="name"
                  name="name"
                  label="Full name"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={handleChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                  required
                  value={values.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={errors.password || "At least 8 characters"}
                />
                <TextField
                  id="address"
                  name="address"
                  label="Address"
                  autoComplete="street-address"
                  multiline
                  minRows={3}
                  required
                  value={values.address}
                  onChange={handleChange("address")}
                  error={!!errors.address}
                  helperText={errors.address}
                />
                <TextField
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone number"
                  placeholder="+1 555 123 4567"
                  autoComplete="tel"
                  required
                  value={values.phone}
                  onChange={handleChange("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />

                {formError && (
                  <Alert severity="error" sx={{ borderRadius: 0 }}>
                    {formError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  endIcon={<ArrowOutwardIcon />}
                >
                  {submitting ? "Creating account…" : "Create Account"}
                </Button>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 4 }}
              >
                Already a member?{" "}
                <Box
                  component={NextLink}
                  href="/login"
                  sx={{ color: "text.primary" }}
                >
                  Sign in
                </Box>
              </Typography>
            </>
          )}
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
