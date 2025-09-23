const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SwaggerFilePath = "./swagger.json";
const OutputDir = "./packages/leagoflegends-client";
const GeneratorName = "typescript-axios";
const NpmName = "@private/leagoflegends-client";
const NpmVersion = "1.0.0";
const SupportsES6 = true;

function generateSqaggerClient() {
    try {
        execSync(
            `npx @openapitools/openapi-generator-cli generate -i ${SwaggerFilePath} -g ${GeneratorName} -o ${OutputDir} --additional-properties=ngVersion=6.1.7,npmName=${NpmName},supportsES6=${SupportsES6},npmVersion=${NpmVersion},withInterfaces=true,modelPropertyNaming=camelCase,enumPropertyNaming=camelCase,prefixParameterInterfaces=true,useSingleRequestParameter=true,modelNamePrefix=LoL,modelNameSuffix=Model,generateAliasAsModel=true,nullSafeAdditionalProps=true,stringEnums=true --skip-validate-spec`,
            { stdio: "inherit" }
        );
        console.log("Swagger client generated successfully.");
    } catch (error) {
        console.error("Error generating Swagger client:", error);
        process.exit(1);
    }

    // ファイルの修正
    const targetDir = OutputDir; // 対象フォルダ

    const fixPatterns = [
        // UNKNOWN_PARAMETER_NAME?: , を UNKNOWN_PARAMETER_NAME?: any, に置換
        {
            regex: /UNKNOWN_PARAMETER_NAME(2)?(\?)?: ,/g,
            replacement: "UNKNOWN_PARAMETER_NAME$1$2: any,",
        },
        // UNKNOWN_PARAMETER_NAME: , を UNKNOWN_PARAMETER_NAME: any, に置換
        {
            regex: /UNKNOWN_PARAMETER_NAME(2)?: ,/g,
            replacement: "UNKNOWN_PARAMETER_NAME$1: any,",
        },
        // interface内のUNKNOWN_PARAMETER_NAME?: を修正
        {
            regex: /UNKNOWN_PARAMETER_NAME(2)?(\?)?: $/gm,
            replacement: "UNKNOWN_PARAMETER_NAME$1$2: any;",
        },
        // readonly UNKNOWN_PARAMETER_NAME?: を修正
        {
            regex: /readonly UNKNOWN_PARAMETER_NAME(2)?(\?)?: $/gm,
            replacement: "readonly UNKNOWN_PARAMETER_NAME$1$2: any;",
        },
    ];

    function replaceInFiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // 再帰的にサブフォルダーも処理
                replaceInFiles(fullPath);
            } else if (
                entry.isFile() &&
                (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))
            ) {
                // ファイル読み込み
                let content = fs.readFileSync(fullPath, "utf8");
                let hasChanges = false;

                // 各修正パターンを適用
                for (const pattern of fixPatterns) {
                    const newContent = content.replace(
                        pattern.regex,
                        pattern.replacement
                    );
                    if (newContent !== content) {
                        content = newContent;
                        hasChanges = true;
                    }
                }

                // 変更があった場合のみ上書き
                if (hasChanges) {
                    fs.writeFileSync(fullPath, content, "utf8");
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }

    replaceInFiles(targetDir);
}

// execute the function
generateSqaggerClient();
