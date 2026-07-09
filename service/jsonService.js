import fs from "fs";

export function saveToJson(filepath, data) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(filepath, jsonData);
}

export function loadFromJson(filepath) {
    if (!fs.existsSync(filepath)) {
        console.log(`No saved data found in ${filepath}`);
        return;
    }

    const jsonData = fs.readFileSync(filepath, "utf-8");

    if (jsonData.trim() === "") {
        console.log(`${filepath} is empty`);
        return [];
    }

    const loadedData = JSON.parse(jsonData);

    return loadedData;
}
