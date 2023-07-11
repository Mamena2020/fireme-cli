import fse from "fs-extra"


const modelScript = () => {
    return `
class ClassName extends Model {
}

ClassName.init({
    fields: {
        name: {
            type: DataTypes.string,
        },
    },
    collection: 'collection_name',
    hasRole: false,
});

export default ClassName;
`
}

const makeModel = (name) => {

    // console.log("Model name: ", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    const file = `models/${name}.js`;

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            // add path tree
            let importModelLine = `core/model/Model.js';`
            let count = file.split("").filter(c => c === "/").length

            for (let i = 0; i < count; i++) {
                importModelLine = `../` + importModelLine
            }
            
            importModelLine = `/* eslint-disable linebreak-style */\nimport Model, { DataTypes } from '` + importModelLine + `\n`

            // get class name from path
            let names = name.split("/") // Catalog/Product  
            let className = names[names.length - 1] // Product
            let collectionName = makeSnakeCase(className)+"s"
            // change class name from default script
            const content = modelScript().replace(/ClassName/g, className).replace(/collection_name/g,collectionName)

            // adding import packages on top of line
            let lines = content.split("\n")
            lines[0] = importModelLine + lines[0]
            let updatedContent = lines.join("\n")

            fse.writeFile(file, updatedContent, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `File created: ${file}`, "\x1b[0m")
            });
        })

    }
    else {
        console.log("\x1b[31m", `File already exists: ${file}`, "\x1b[0m")
    }
}

const makeSnakeCase = (str) => {
    let result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
    return result.charAt(0) === '_' ? result.substr(1) : result;
}



export default makeModel