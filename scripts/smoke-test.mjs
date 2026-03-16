import path from "node:path";
import { chromium } from "playwright";

async function ensureSignedIn(page) {
  await page.goto("http://localhost:3000/gear/new", { waitUntil: "networkidle" });

  if (!page.url().endsWith("/login")) {
    return;
  }

  await page.getByLabel("Email").fill("demo@camplog.app");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("**/dashboard");
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  const stamp = Date.now();
  const gearName = `Trail Kettle ${stamp}`;
  const logTitle = `Smoke Test Camp ${stamp}`;

  await ensureSignedIn(page);

  await page.goto("http://localhost:3000/gear/new", { waitUntil: "networkidle" });
  await page.getByLabel("Gear name").fill(gearName);
  await page.getByLabel("Brand").fill("River Peak");
  await page.getByLabel("Memo").fill("Used for coffee and soup.");
  await page.getByRole("button", { name: "Save Gear" }).click();
  await page.waitForURL("**/gear");

  await page.goto("http://localhost:3000/logs/new", { waitUntil: "networkidle" });
  await page.getByLabel("Title").fill(logTitle);
  await page.getByLabel("Location").fill("Kiyosato Highlands");
  await page.getByLabel("Notes").fill("Automated smoke test entry.");
  await page.getByText(gearName).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles(path.join(process.cwd(), "public/icons/camp-icon.svg"));
  await page.getByRole("button", { name: "Save Log" }).click();
  await page.waitForURL(/\/logs\/(?!new$).+/);

  const bodyText = await page.locator("body").innerText();
  const imgCount = await page.locator("img").count();

  console.log(
    JSON.stringify(
      {
        finalUrl: page.url(),
        detailHasTitle: bodyText.includes(logTitle),
        detailHasGear: bodyText.includes(gearName),
        detailHasPhotoEmptyState: bodyText.includes("No photos uploaded yet."),
        imgCount,
      },
      null,
      2,
    ),
  );

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
