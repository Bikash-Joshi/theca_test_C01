"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createClient } from "@/lib/supabase/client";

type Props = { email: string; name: string; address: string; phone: string };

export default function AccountView({ email, name, address, phone }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    severity: "success" | "error";
    text: string;
  } | null>(null);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setMessage({ severity: "error", text: "Use at least 8 characters." });
      return;
    }
    const { error } = await createClient().auth.updateUser({ password });
    if (error) setMessage({ severity: "error", text: error.message });
    else {
      setMessage({ severity: "success", text: "Password updated." });
      setPassword("");
    }
  };

  const details = [
    ["Name", name],
    ["Email", email],
    ["Address", address],
    ["Phone", phone],
  ];

  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", mb: 8 }}
        >
          <Typography
            component={NextLink}
            href="/"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.19em",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MAISON ÉLAN
          </Typography>
          <Button color="inherit" onClick={signOut}>
            Sign out
          </Button>
        </Stack>

        <Typography variant="overline" color="text.secondary">
          YOUR ACCOUNT
        </Typography>
        <Typography variant="h2" sx={{ fontSize: 40, mt: 1, mb: 4 }}>
          Welcome{name ? `, ${name.split(/\s+/)[0]}` : ""}.
        </Typography>

        <Stack spacing={2.5}>
          {details.map(([label, value]) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line" }}>
                {value || "—"}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 5 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Change password
        </Typography>
        <Stack component="form" spacing={2} onSubmit={changePassword}>
          <TextField
            type="password"
            label="New password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {message && (
            <Alert severity={message.severity} sx={{ borderRadius: 0 }}>
              {message.text}
            </Alert>
          )}
          <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
            Update password
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
