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

	const products = await page.$$(
		"div.s-main-slot.s-result-list.s-search-results.sg-row  > div.s-result-item",
	);

	console.log(products.length);

	let jsonFile = [];
	let productTitle = "Null";
	let productPrice = "Null";
	let productImg = "Null";
	for (const product of products) {
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
			jsonFile.push({ productTitle, productPrice, productImg });
		}

		// await browser.close();
	}

	// Write to Json File

	fs.writeFile("data.json", JSON.stringify(jsonFile), (err) => {
		if (err) {
			console.log(`Error writing to Json File!`, err);
		} else {
			console.log("File written successfully\n");
			console.log(jsonFile.length);
		}
	});
};

main();
