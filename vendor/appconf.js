import fs from 'fs';
import appConfig from '@azure/app-configuration';
import azureIdentity from '@azure/identity';

const profile = process.env.MODE || 'local';

async function loadAppConfig(profile = "") {
  if (!profile) throw Error("Invalid profile");
  
  const define = {};
  const client = await new appConfig.AppConfigurationClient(
    `https://fingger-${profile}-appconfig.azconfig.io`,
    new azureIdentity.DefaultAzureCredential()
  );
  const configList = client.listConfigurationSettings({
    labelFilter: "WebClient",
    fields: ["key", "value"]
  });

  for await (let item of configList) {
    define[item.key] = item.value;
  }
  // NOTE: Save setting file as json
  fs.writeFileSync("appconfig.json", JSON.stringify(define, null, "  "));
  console.info(`Saved appconfig.json for ${ profile }`);
}

loadAppConfig(profile);


