const cheerio = require('cheerio');
const { stringify } = require('querystring');
const { SETTING_URL, http } = require('../../utils/http');
const SettingsDescriptor = require('./SettingsDescriptor');

const get = () => http.get(SETTING_URL).then(res => parseSettingPage(res.data));

const apply = settings => {
  const data = settings2Data(settings);
  data.apply = 'Apply';

  return http.post(SETTING_URL, stringify(data));
};

const parseSettingPage = html => {
  const $ = cheerio.load(html);

  const settings = {};

  Object.keys(SettingsDescriptor).map(key => {
    switch (SettingsDescriptor[key].type) {
      case 'radio':
        parseRadioItem($, key, settings);
        break;
      case 'checkbox':
        parseCheckItem($, key, settings);
        break;
      case 'text':
        parseTextItem($, key, settings);
        break;
      default:
        parseLanguages($, key, settings);
        break;
    }
  });

  return settings;
};

const parseRadioItem = ($, key, settings) => {
  const { name, values, defaultValue } = SettingsDescriptor[key];
  settings[key] = values[$(`[name=${name}][checked]`).val()] || defaultValue;
};

const parseCheckItem = ($, key, settings) => {
  const { name } = SettingsDescriptor[key];
  settings[key] = !!$(`[name=${name}]`).attr('checked');
};

const parseTextItem = ($, key, settings) => {
  const { name } = SettingsDescriptor[key];
  settings[key] = $(`[name=${name}]`).val();
};

const parseLanguages = ($, key, settings) => {
  const languageDescriptor = SettingsDescriptor[key];
  const types = Object.keys(languageDescriptor);

  const languageSettings = {};
  for (const t of types) {
    const { name } = languageDescriptor[t];
    languageSettings[t] = !!$(`[name=${name}]`).attr('checked');
  }

  settings[key] = languageSettings;
};

const settings2Data = settings => {
  const data = {};

  Object.keys(settings).map(key => {
    const descriptor = SettingsDescriptor[key];
    const currentValue = settings[key];
    switch (descriptor.type) {
      case 'radio':
        data[descriptor.name] = Object.values(descriptor.values).indexOf(currentValue);
        break;
      case 'checkbox':
        if (currentValue) {
          data[descriptor.name] = 'on';
        }
        break;
      case 'text':
        data[descriptor.name] = currentValue || '';
        break;
      default:
        Object.keys(currentValue).map(k => {
          if (currentValue[k]) {
            data[descriptor[k].name] = 'on';
          }
        });
        break;
    }
  });

  return data;
};

module.exports = {
  get,
  apply
};
