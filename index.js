import puppeteer from "puppeteer";

const main = async () => {
	// Launch a headless browser

	try {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		await page.goto(
			"https://www.amazon.com/b?node=16225009011&pf_rd_r=S3F0SBHE3KJ0HGB248PT&pf_rd_p=5232c45b-5929-4ff0-8eae-5f67afd5c3dc&pd_rd_r=c8917604-69d7-4a93-aba6-9e597f6e92ac&pd_rd_w=zsyL9&pd_rd_wg=wu00B&ref_=pd_gw_unk",
		);

		await browser.close();
	} catch (error) {
		console.log(`Error Launching Scraper!`, error);
	}
};

main();
