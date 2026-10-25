import { expect, test, type Page, type Request } from "@playwright/test";

// Supabase signUp is mocked so tests never create real users or send emails.
const SIGNUP_API = "**/auth/v1/signup**";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  password: "supersecret1",
  address: "12 St James's Square, London",
  phone: "+44 20 7946 0958",
};
type Values = typeof valid;

const fakeUser = (email: string) => ({
  id: "11111111-1111-1111-1111-111111111111",
  aud: "authenticated",
  role: "",
  email,
  created_at: new Date().toISOString(),
  identities: [{ identity_id: "x", id: "x", user_id: "x", provider: "email" }],
});

async function mockConfirmationRequired(page: Page) {
  await page.route(SIGNUP_API, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fakeUser(valid.email)),
    }),
  );
}

async function fill(page: Page, overrides: Partial<Values> = {}) {
  const v = { ...valid, ...overrides };
  await page.locator("#name").fill(v.name);
  await page.locator("#email").fill(v.email);
  await page.locator("#password").fill(v.password);
  await page.locator("#address").fill(v.address);
  await page.locator("#phone").fill(v.phone);
}

const submit = (page: Page) =>
  page.getByRole("button", { name: /create account|creating account/i });

function trackSignupRequests(page: Page) {
  const requests: Request[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/auth/v1/signup")) requests.push(r);
  });
  return requests;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/signup");
});

test.describe("page", () => {
  test("renders the form with all fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Sign up." })).toBeVisible();
    for (const id of ["name", "email", "password", "address", "phone"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(submit(page)).toBeEnabled();
  });

  test("password field is masked", async ({ page }) => {
    await expect(page.locator("#password")).toHaveAttribute("type", "password");
  });

  test("'Sign in' link goes to /login", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("'Back to home' link goes to /", async ({ page }) => {
    await page.getByRole("link", { name: /back to home/i }).click();
    await expect(page).toHaveURL(/localhost:3000\/$/);
  });
});

test.describe("validation", () => {
  test("empty submit shows every required error and sends no request", async ({
    page,
  }) => {
    const requests = trackSignupRequests(page);
    await submit(page).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
    await expect(page.getByText("Address is required")).toBeVisible();
    await expect(page.getByText("Phone number is required")).toBeVisible();
    expect(requests).toHaveLength(0);
  });

  test("whitespace-only values count as empty", async ({ page }) => {
    await fill(page, { name: "   ", email: "   ", address: "   ", phone: "   " });
    await submit(page).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Address is required")).toBeVisible();
    await expect(page.getByText("Phone number is required")).toBeVisible();
  });

  for (const email of ["plainaddress", "a@b", "a@b.", "@example.com", "a b@c.com"]) {
    test(`rejects invalid email "${email}"`, async ({ page }) => {
      const requests = trackSignupRequests(page);
      await fill(page, { email });
      await submit(page).click();
      await expect(page.getByText("Enter a valid email address")).toBeVisible();
      expect(requests).toHaveLength(0);
    });
  }

  test("accepts email with plus tag and surrounding spaces", async ({ page }) => {
    await mockConfirmationRequired(page);
    await fill(page, { email: "  ada+test@sub.example.co.uk  " });
    await submit(page).click();
    await expect(page.getByText("Thank you, Ada.")).toBeVisible();
  });

  test("rejects a 7-character password", async ({ page }) => {
    await fill(page, { password: "1234567" });
    await submit(page).click();
    await expect(page.getByText("Use at least 8 characters")).toBeVisible();
  });

  test("accepts an exactly 8-character password", async ({ page }) => {
    await mockConfirmationRequired(page);
    await fill(page, { password: "12345678" });
    await submit(page).click();
    await expect(page.getByText("Thank you, Ada.")).toBeVisible();
  });

  test("password of only spaces is not treated as empty", async ({ page }) => {
    // 8 spaces is non-empty and long enough; documents current behaviour.
    await mockConfirmationRequired(page);
    await fill(page, { password: "        " });
    await submit(page).click();
    await expect(page.getByText("Password is required")).toHaveCount(0);
  });

  for (const phone of ["abcdefg", "12345", "1".repeat(21), "+44 (20) 79x6"]) {
    test(`rejects invalid phone "${phone}"`, async ({ page }) => {
      const requests = trackSignupRequests(page);
      await fill(page, { phone });
      await submit(page).click();
      await expect(page.getByText("Enter a valid phone number")).toBeVisible();
      expect(requests).toHaveLength(0);
    });
  }

  for (const phone of ["1234567", "+1 555 123 4567", "(555) 123-4567", "1".repeat(20)]) {
    test(`accepts valid phone "${phone}"`, async ({ page }) => {
      await mockConfirmationRequired(page);
      await fill(page, { phone });
      await submit(page).click();
      await expect(page.getByText("Thank you, Ada.")).toBeVisible();
    });
  }

  test("a field error clears as soon as the user types in it", async ({ page }) => {
    await submit(page).click();
    await expect(page.getByText("Name is required")).toBeVisible();
    await page.locator("#name").fill("A");
    await expect(page.getByText("Name is required")).toHaveCount(0);
    // other errors remain
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("only the invalid fields show errors", async ({ page }) => {
    await fill(page, { phone: "bad" });
    await submit(page).click();
    await expect(page.getByText("Enter a valid phone number")).toBeVisible();
    await expect(page.getByText("Name is required")).toHaveCount(0);
    await expect(page.getByText("Enter a valid email address")).toHaveCount(0);
  });
});

test.describe("successful signup (email confirmation required)", () => {
  test("shows confirmation message and sign-in link", async ({ page }) => {
    await mockConfirmationRequired(page);
    await fill(page);
    await submit(page).click();

    await expect(page.getByText("Thank you, Ada.")).toBeVisible();
    await expect(
      page.getByText(`Check ${valid.email} for a confirmation link`),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /go to sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
    await expect(page.locator("#name")).toHaveCount(0);
  });

  test("sends trimmed metadata, email and redirect URL to Supabase", async ({
    page,
  }) => {
    await mockConfirmationRequired(page);
    const [request] = await Promise.all([
      page.waitForRequest(SIGNUP_API),
      (async () => {
        await fill(page, {
          name: "  Ada Lovelace  ",
          email: "  ada@example.com  ",
          address: "  12 Square  ",
          phone: "  +44 20 7946 0958  ",
        });
        await submit(page).click();
      })(),
    ]);

    const body = request.postDataJSON();
    expect(body.email).toBe("ada@example.com");
    expect(body.password).toBe(valid.password);
    expect(body.data).toEqual({
      name: "Ada Lovelace",
      address: "12 Square",
      phone: "+44 20 7946 0958",
    });
    expect(request.url()).toContain(
      encodeURIComponent("http://localhost:3000/auth/callback"),
    );
  });

  test("greets by first name only for multi-word / padded names", async ({ page }) => {
    await mockConfirmationRequired(page);
    await fill(page, { name: "   Mary   Jane   Watson " });
    await submit(page).click();
    await expect(page.getByText("Thank you, Mary.")).toBeVisible();
  });

  test("handles unicode names and multi-line addresses", async ({ page }) => {
    await mockConfirmationRequired(page);
    const requestPromise = page.waitForRequest(SIGNUP_API);
    await fill(page, { name: "Zoë Müller-Åberg", address: "Line 1\nLine 2" });
    await submit(page).click();
    await expect(page.getByText("Thank you, Zoë.")).toBeVisible();
    const body = (await requestPromise).postDataJSON();
    expect(body.data.address).toBe("Line 1\nLine 2");
  });

  test("HTML in the name is rendered as text, not executed", async ({ page }) => {
    await mockConfirmationRequired(page);
    let dialog = false;
    page.on("dialog", (d) => {
      dialog = true;
      d.dismiss();
    });
    await fill(page, { name: "<img src=x onerror=alert(1)>" });
    await submit(page).click();
    await expect(page.getByText("Thank you,")).toBeVisible();
    await expect(page.locator("main img[src='x']")).toHaveCount(0);
    expect(dialog).toBe(false);
  });

  test("submits with the Enter key", async ({ page }) => {
    await mockConfirmationRequired(page);
    await fill(page);
    await page.locator("#phone").press("Enter");
    await expect(page.getByText("Thank you, Ada.")).toBeVisible();
  });
});

test.describe("successful signup (auto-confirmed session)", () => {
  test("leaves /signup and heads to /account", async ({ page }) => {
    await page.route(SIGNUP_API, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "fake.access.token",
          refresh_token: "fake-refresh",
          token_type: "bearer",
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: fakeUser(valid.email),
        }),
      }),
    );
    await fill(page);
    await submit(page).click();
    // The token is fake, so the server-side guard may bounce to /login; either
    // way the user must not stay on /signup nor see the confirmation message.
    await expect(page).toHaveURL(/\/(account|login)/, { timeout: 20_000 });
    await expect(page.getByText("Check ada@example.com")).toHaveCount(0);
  });
});

test.describe("failures", () => {
  test("shows server error for an already registered email", async ({ page }) => {
    await page.route(SIGNUP_API, (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          code: 422,
          error_code: "user_already_exists",
          msg: "User already registered",
        }),
      }),
    );
    await fill(page);
    await submit(page).click();

    await expect(page.getByRole("alert").filter({ hasText: "User already registered" })).toBeVisible();
    // form stays, values preserved, button usable again
    await expect(page.locator("#email")).toHaveValue(valid.email);
    await expect(submit(page)).toBeEnabled();
  });

  test("shows weak-password error returned by the server", async ({ page }) => {
    await page.route(SIGNUP_API, (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          code: 422,
          error_code: "weak_password",
          msg: "Password should contain at least one number.",
        }),
      }),
    );
    await fill(page, { password: "onlyletters" });
    await submit(page).click();
    await expect(page.getByText("Password should contain at least one number.")).toBeVisible();
  });

  test("shows rate-limit error (429)", async ({ page }) => {
    await page.route(SIGNUP_API, (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          code: 429,
          error_code: "over_email_send_rate_limit",
          msg: "Email rate limit exceeded",
        }),
      }),
    );
    await fill(page);
    await submit(page).click();
    await expect(page.getByText("Email rate limit exceeded")).toBeVisible();
  });

  test("shows an error when the network request fails", async ({ page }) => {
    await page.route(SIGNUP_API, (route) => route.abort("failed"));
    await fill(page);
    await submit(page).click();
    await expect(
      page.getByRole("alert").filter({ hasText: /failed to fetch/i }),
    ).toBeVisible();
    await expect(submit(page)).toBeEnabled();
  });

  test("a previous server error is cleared on the next submit", async ({ page }) => {
    let first = true;
    await page.route(SIGNUP_API, (route) => {
      if (first) {
        first = false;
        return route.fulfill({
          status: 422,
          contentType: "application/json",
          body: JSON.stringify({ code: 422, msg: "User already registered" }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeUser(valid.email)),
      });
    });
    await fill(page);
    await submit(page).click();
    await expect(page.getByText("User already registered")).toBeVisible();
    await submit(page).click();
    await expect(page.getByText("Thank you, Ada.")).toBeVisible();
    await expect(page.getByText("User already registered")).toHaveCount(0);
  });
});

test.describe("submission state", () => {
  test("button is disabled and labelled while submitting; double click sends one request", async ({
    page,
  }) => {
    const requests = trackSignupRequests(page);
    await page.route(SIGNUP_API, async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeUser(valid.email)),
      });
    });
    await fill(page);
    const button = submit(page);
    await button.dblclick();

    await expect(button).toBeDisabled();
    await expect(button).toHaveText(/creating account/i);
    await expect(page.getByText("Thank you, Ada.")).toBeVisible();
    expect(requests).toHaveLength(1);
  });
});
