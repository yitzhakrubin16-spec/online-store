import fs from "fs";

export function saveToJson(filename, data) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(filename, jsonData);
}

export function loadFromJson(filename) {
    if (!fs.existsSync(filename)) {
        console.log(`No saved data found in ${filename}`);
        return;
    }

    const jsonData = fs.readFileSync(filename, "utf-8");

    if (jsonData.trim() === "") {
        console.log(`${filename} is empty`);
        return [];
    }

    const loadedData = JSON.parse(jsonData);

    return loadedData;
}
