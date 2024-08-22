const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * @param {string} message
 */
function writeLine(message) {
  rl.write(`${message}\n`);
}

/**
 * @param {...string} messages
 * @returns {Promise<string>}
 */
async function ask(...messages) {
  return new Promise((resolve) => {
    for (let i = 0; i < messages.length - 1; i++) {
      rl.write(`${messages[i]}\n`);
    }
    rl.question(`${messages[messages.length - 1]}\n`, resolve);
  });
}

/**
 * @param {RegExp} regex
 * @param {string} regexFormat
 * @param {(rawValue: string): number} parser
 * @param {...string} messages
 * @returns {Promise<number>}
 */
async function askNumberFormat(regex, regexFormat, parser, ...messages) {
  const answer = await ask(...messages);

  if (!regex.test(answer)) {
    writeLine(`Formato inválido "${answer}", o correto é "${regexFormat}"`);
    writeLine(`Tente novamente!\n`);
    return askNumberFormat(regex, regexFormat, parser, ...messages);
  }

  return parser(answer);
}

/**
 * @param {...string} messages
 * @returns {Promise<number>}
 */
function askMoneyFormat(...messages) {
  return askNumberFormat(
    new RegExp('^[\\d]+([\\.|,]{1}[\\d]{1,2})?$'),
    '12345.67',
    (rawValue) => Number.parseFloat(rawValue.replace('%', '').replace(',', '.')),
    ...messages,
  );
}

/**
 * @param {...string} messages
 * @returns {Promise<number>}
 */
function askSimpleNumberFormat(...messages) {
  return askNumberFormat(new RegExp('^[\\d]+$'), '12345', Number.parseFloat, ...messages);
}

/**
 * @param {...string} messages
 * @returns {Promise<number>}
 */
function askPercentageFormat(...messages) {
  return askNumberFormat(
    new RegExp('^[\\d]+([\\.|,]{1}[\\d]+)?$'),
    '12.3456789%',
    (rawValue) => Number.parseFloat(rawValue.replace('%', '').replace(',', '.')) / 100,
    ...messages,
  );
}

module.exports = {
  writeLine,
  ask,
  askNumberFormat,
  askMoneyFormat,
  askSimpleNumberFormat,
  askPercentageFormat,
};
