import { expect, Page } from "@playwright/test";

export async function oidcLogin(
  page: Page,
  userName = "User1",
  password = "pwd",
  isMobile = false
) {
  if (isMobile) {
    await expect(page.locator("button#burgerIcon")).toBeVisible();
    const mobileMenuVisible = await page
      .locator("button#burgerIcon img.tw-rotate-0")
      .isVisible();
    if (mobileMenuVisible) {
      await page.click("button#burgerIcon");
    }
  }
  await page.click("#menuIcon img:first-child");
  await page.click('a:has-text("Sign in")');

  await page.fill("#Input_Username", userName, {
    timeout: 40_000,
  });
  await page.fill("#Input_Password", password);

  await page.click('button:has-text("Login")', {
    // Give ample time for login to occur
    timeout: 50000
  });

  if (!isMobile) {
    await expect(page.locator("button#menuIcon").first()).toBeVisible({
      timeout: 50_000,
    });
  } else {
    await expect(page.locator("button#burgerIcon")).toBeVisible({
      timeout: 50_000,
    });
  }
}

export async function oidcLogout(page: Page, isMobile = false) {
  if (isMobile) {
    await expect(page.locator("button#burgerIcon")).toBeVisible();
    const mobileMenuVisible = await page
      .locator("button#burgerIcon img.tw-rotate-0")
      .isVisible();
    if (mobileMenuVisible) {
      await page.click("button#burgerIcon");
    }
  }
  await page.click("#menuIcon img:first-child");
  await page.click('button:has-text("Log out")');
  await expect(page.getByRole('heading', { name: 'Profile' })).toBeHidden();
}

export async function oidcAdminTagLogin(page, isMobile = false) {
  await oidcLogin(page, "User1", "pwd", isMobile);
}

export async function oidcMatrixUserLogin(page, isMobile = false) {
  await oidcLogin(page, "UserMatrix", "pwd", isMobile);
}

export async function oidcMemberTagLogin(page, isMobile = false) {
  await oidcLogin(page, "User2", "pwd", isMobile);
}
