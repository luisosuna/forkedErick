import { test, expect } from '@playwright/test';

test.skip('Google Search with CSS - Force to Fail', async ({ page }) => {
  await page.goto('https://google.com/');

  //await page.locator("").type  
  await page.type("[name='q']", "my very first search"); //just writes
  await page.waitForTimeout(1500);
  await page.fill("[name='q']", "my second search"); //clear and then writes 

  //Assert PASS
  expect("Erick").toBe("Erick");

  //Assert FAIL
  //expect("Erick").toBe("Jimenez");
});

test.skip('Google Search with Xpath', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://google.com/');
    await page.fill("//*[@name='q']", "Where is the next SuperBowl?"); //clear and then writes 
  
    //Assert PASS
    expect("Lionel Messi").toContain("Messi");

    //Assert PASS
    expect(90).toBeGreaterThanOrEqual(25);

    //Assert PASS
    expect(100).toBeLessThan(200);
  });
