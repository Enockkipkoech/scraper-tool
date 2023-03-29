import puppeteer from "puppeteer";

const main = async () => {
	try {
		const browser = await puppeteer.launch({
			headless: false,
			defaultViewport: false,
			userDataDir: "./pagination",
		});

		const page = await browser.newPage();
		await page.goto(
			"https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071%2Cp_36%3A1253503011&dc&fs=true&page=3&qid=1680079743&rnid=16225007011&ref=sr_pg_2",
			{
				waitUntil: "load",
			},
		);

		const is_disabled =
			page.$(".s-pagination-item.s-pagination-next.s-pagination-disabled") !==
			null; // .s-pagination-item.s-pagination-next.s-pagination-disabled

		console.log(`is disabled? : `, is_disabled);
	} catch (error) {
		console.log(`Error Launching Scraper!`, error);
	}
};

main();
