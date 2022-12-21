import { exec } from 'child_process';

const target = 'http://localhost:5000/swagger/v1/swagger.json'

const command = `openapi \
-i ${target} \
-o ./src/lib/apis \
-c axios \
--useOptions \
--useUnionTypes \
--postfix Api \
--indent 2 \
--request ./vendor/openapi@request.ts`;

// console.log(command);

exec(command, (e, s, f) => e && console.error(`stderr: ${f}`));