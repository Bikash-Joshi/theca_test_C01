"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/client";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const navLinks = [
  { label: "Collection", href: "#collection" },
  { label: "Our Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

const collections = [
  {
    title: "The Essentials",
    subtitle: "Everyday sophistication",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Modern Classics",
    subtitle: "Made to last",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Quiet Luxury",
    subtitle: "Understated by nature",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
];

function Brand() {
  return (
    <Typography
      component={NextLink}
      href="/"
      variant="h6"
      noWrap
      sx={{
        fontFamily: "inherit",
        fontWeight: 600,
        letterSpacing: "0.19em",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      MAISON ÉLAN
    </Typography>
  );
}

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Box component="main">
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: "background.default" }}
      >
        <Toolbar sx={{ height: 84, px: { xs: 2, md: "7%" } }} disableGutters>
          <Brand />
          <Stack
            direction="row"
            spacing={5}
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: { xs: "none", md: "flex" },
            }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                color="inherit"
                underline="none"
                variant="body2"
                sx={{ "&:hover": { opacity: 0.55 } }}
              >
                {l.label}
              </Link>
            ))}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", ml: "auto" }}
          >
            <Button
              component={NextLink}
              href={signedIn ? "/account" : "/login"}
              color="inherit"
            >
              {signedIn ? "Account" : "Login"}
            </Button>
            <Button
              component={NextLink}
              href="/signup"
              variant="outlined"
              color="primary"
              endIcon={<ArrowOutwardIcon />}
            >
              Explore
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: "relative",
          minHeight: { xs: 560, md: 680 },
          display: "flex",
          alignItems: "center",
          color: "common.white",
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(20,19,17,.68), rgba(20,19,17,.28)), url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=85)",
            md: "linear-gradient(90deg, rgba(20,19,17,.7) 0%, rgba(20,19,17,.4) 42%, rgba(20,19,17,.1) 100%), url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=85)",
          },
          backgroundSize: "cover",
          backgroundPosition: { xs: "58% center", md: "center" },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: "7%" } }}>
          <Typography variant="overline" sx={{ opacity: 0.85 }}>
            THE ART OF LESS
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 52, md: 96 }, my: 2 }}
          >
            Elegance
            <br />
            in every
            <br />
            <Box component="span" sx={{ fontStyle: "italic" }}>
              detail.
            </Box>
          </Typography>
          <Typography sx={{ maxWidth: 420, mb: 4, opacity: 0.85 }}>
            Thoughtfully crafted essentials. Designed to transcend seasons.
          </Typography>
          <Button
            href="#collection"
            variant="contained"
            color="inherit"
            endIcon={<ArrowOutwardIcon />}
            sx={{ bgcolor: "common.white", color: "text.primary" }}
          >
            Discover the Collection
          </Button>
        </Container>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between",
            position: "absolute",
            bottom: 24,
            left: { xs: 16, md: "7%" },
            right: { xs: 16, md: "7%" },
            opacity: 0.75,
          }}
        >
          <Typography variant="caption" sx={{ letterSpacing: "0.2em" }}>
            TIMELESS BY DESIGN
          </Typography>
          <Typography variant="caption" sx={{ letterSpacing: "0.2em" }}>
            01 — 03
          </Typography>
        </Stack>
      </Box>

      {/* Collection */}
      <Container
        component="section"
        id="collection"
        maxWidth="xl"
        sx={{ py: { xs: 8, md: 14 }, px: { xs: 2, md: "7%" } }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "flex-end" }, mb: 6 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              CURATED WITH INTENTION
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 56 } }}>
              Less, but better.
            </Typography>
          </Box>
          <Link
            href="#story"
            color="inherit"
            underline="hover"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            Our philosophy <ArrowOutwardIcon fontSize="small" />
          </Link>
        </Stack>

        <Grid container spacing={4}>
          {collections.map((c, i) => (
            <Grid key={c.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={0} sx={{ bgcolor: "transparent" }}>
                <CardActionArea href="#story" sx={{ overflow: "hidden" }}>
                  <CardMedia
                    image={c.image}
                    title={c.title}
                    sx={{
                      aspectRatio: { xs: 0.95, md: 0.78 },
                      transition: "transform .6s ease",
                      ".MuiCardActionArea-root:hover &": {
                        transform: "scale(1.025)",
                      },
                    }}
                  />
                </CardActionArea>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "flex-start", pt: 2 }}
                >
                  <Box>
                    <Typography variant="h5">{c.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.subtitle}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {String(i + 1).padStart(2, "0")}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Brand story */}
      <Box
        component="section"
        id="story"
        sx={{ bgcolor: "#efece5", py: { xs: 10, md: 16 }, textAlign: "center" }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" color="text.secondary">
            A DIFFERENT PERSPECTIVE
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 34, md: 60 }, my: 3 }}
          >
            True luxury isn&apos;t about having more. It&apos;s about{" "}
            <Box component="span" sx={{ fontStyle: "italic" }}>
              choosing better.
            </Box>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 560, mx: "auto", mb: 4 }}
          >
            We believe in fewer things, made with greater care. In thoughtful
            design, lasting materials, and the beauty of simplicity.
          </Typography>
          <Link
            href="#contact"
            color="inherit"
            underline="hover"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            Discover our story <ArrowOutwardIcon fontSize="small" />
          </Link>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        id="contact"
        sx={{ py: 6, px: { xs: 2, md: "7%" }, borderTop: 1, borderColor: "divider" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
        >
          <Brand />
          <Typography color="text.secondary">
            Designed for a life well lived.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © 2026 MAISON ÉLAN
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
