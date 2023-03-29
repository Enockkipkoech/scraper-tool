import puppeteer from "puppeteer";
import fs from "fs";

const main = async () => {
	// Launch a headless browser

	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: false,
		userDataDir: "./data",
	});
	const page = await browser.newPage();
	await page.goto(
		"https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071%2Cp_36%3A1253503011&dc&fs=true&qid=1635596580&rnid=16225007011&ref=sr_pg_1",
	);

	let is_BtnDisabled = false;

	let jsonFile = [];

	while (!is_BtnDisabled) {
		const products = await page.$$(
			"div.s-main-slot.s-result-list.s-search-results.sg-row  > div.s-result-item",
		);

		console.log(products.length);

		for (const product of products) {
			let productTitle = "Null";
			let productPrice = "Null";
			let productImg = "Null";
			try {
				productTitle = await page.evaluate(
					(el) => el.querySelector("h2 > a > span").textContent,
					product,
				);
			} catch (error) {
				// console.log(`Error Launching Scraper!`, error);
			}

			try {
				productPrice = await page.evaluate(
					(el) => el.querySelector(".a-price > .a-offscreen").textContent,
					product,
				);
			} catch (error) {
				// console.log(`Error Launching Scraper!`, error);
			}

			try {
				productImg = await page.evaluate(
					(el) => el.querySelector(".s-image").getAttribute("src"),
					product,
				);
				// console.log("Img", productImg);
			} catch (error) {
				// console.log(`Error Launching Scraper!`, error);
			}

			if (
				productTitle !== "Null" ||
				productPrice !== "Null" ||
				productImg !== "Null"
			) {
				jsonFile.push({
					productTitle,
					productPrice,
					productImg,
				});

				// Write to Json File after every iteration(synchronous)
				fs.writeFileSync(
					"results.json",
					JSON.stringify(jsonFile),
					function (err) {
						if (err) throw err;
					},
				);
			}
		}

		await page.waitForSelector(".s-pagination-next", { visible: true });

		const is_disabled =
			(await page.$(".s-pagination-next.s-pagination-disabled")) !== null; // .s-pagination-item.s-pagination-next.s-pagination-disabled

		is_BtnDisabled = is_disabled;

		if (!is_disabled) {
			console.log(`is disabled? : `, is_disabled);
			console.log(`Next Button Clicked!`);
			try {
				await Promise.all([
					page.click(".s-pagination-next"),
					page.waitForNavigation({ waitUntil: "networkidle2" }),
				]);
			} catch (error) {
				console.log(`Error Clicking Next Button!`, error);
			}
		}

		await browser.close();
	}

	// Write to Json File
	fs.writeFile("pagination.json", JSON.stringify(jsonFile), (err) => {
		if (err) {
			console.log(`Error writing to Json File!`, err);
		} else {
			console.log("File written successfully\n");
			console.log(jsonFile);
		}
	});
};

main();
