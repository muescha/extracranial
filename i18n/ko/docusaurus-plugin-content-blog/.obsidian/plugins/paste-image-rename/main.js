/* THIS IS A GENERATED/BUNDLED FILE BY ESBUILD */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) =>
  __defProp(target, '__esModule', { value: true });
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
    });
};
var __reExport = (target, module2, desc) => {
  if (
    (module2 && typeof module2 === 'object') ||
    typeof module2 === 'function'
  ) {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== 'default')
        __defProp(target, key, {
          get: () => module2[key],
          enumerable:
            !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
        });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        module2 && module2.__esModule && 'default' in module2
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true },
      ),
    ),
    module2,
  );
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) =>
      x.done
        ? resolve(x.value)
        : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// package.json
var require_package = __commonJS({
  'package.json'(exports, module2) {
    module2.exports = {
      name: 'obsidian-paste-image-rename',
      version: '1.5.0',
      main: 'main.js',
      scripts: {
        start: 'node esbuild.config.mjs',
        build:
          'tsc -noEmit -skipLibCheck && BUILD_ENV=production node esbuild.config.mjs && cp manifest.json build',
        version: 'node version-bump.mjs && git add manifest.json versions.json',
        release:
          'yarn build && gh release create ${npm_package_version} build/*',
      },
      keywords: [],
      author: 'Reorx',
      license: 'MIT',
      devDependencies: {
        '@types/node': '^16.11.6',
        '@typescript-eslint/eslint-plugin': '^5.2.0',
        '@typescript-eslint/parser': '^5.2.0',
        'builtin-modules': '^3.2.0',
        esbuild: '0.13.12',
        obsidian: '^0.13.26',
        tslib: '2.3.1',
        typescript: '4.4.4',
      },
      dependencies: {
        'cash-dom': '^8.1.1',
      },
    };
  },
});

// src/main.ts
__export(exports, {
  default: () => PasteImageRenamePlugin,
});
var import_obsidian2 = __toModule(require('obsidian'));

// src/batch.ts
var import_obsidian = __toModule(require('obsidian'));

// src/utils.ts
var DEBUG = false;
function debugLog(...args) {
  if (DEBUG) {
    console.log(new Date().toISOString().slice(11, 23), ...args);
  }
}
function createElementTree(rootEl, opts) {
  const result = {
    el: rootEl.createEl(opts.tag, opts),
    children: [],
  };
  const children = opts.children || [];
  for (const child of children) {
    result.children.push(createElementTree(result.el, child));
  }
  return result;
}
var path = {
  join(...partSegments) {
    let parts = [];
    for (let i = 0, l = partSegments.length; i < l; i++) {
      parts = parts.concat(partSegments[i].split('/'));
    }
    const newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
      const part = parts[i];
      if (!part || part === '.') continue;
      else newParts.push(part);
    }
    if (parts[0] === '') newParts.unshift('');
    return newParts.join('/');
  },
  basename(fullpath) {
    const sp = fullpath.split('/');
    return sp[sp.length - 1];
  },
  extension(fullpath) {
    const positions = [...fullpath.matchAll(new RegExp('\\.', 'gi'))].map(
      (a) => a.index,
    );
    return fullpath.slice(positions[positions.length - 1] + 1);
  },
};
var filenameNotAllowedChars = /[^a-zA-Z0-9~`!@$&*()\-_=+{};'",<.>? ]/g;
var sanitizer = {
  filename(s) {
    return s.replace(filenameNotAllowedChars, '').trim();
  },
  delimiter(s) {
    s = this.filename(s);
    if (!s) s = '-';
    return s;
  },
};
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function lockInputMethodComposition(el) {
  const state = {
    lock: false,
  };
  el.addEventListener('compositionstart', () => {
    state.lock = true;
  });
  el.addEventListener('compositionend', () => {
    state.lock = false;
  });
  return state;
}
function getVaultConfig(app) {
  const vault = app.vault;
  return vault.config;
}

// src/batch.ts
var ImageBatchRenameModal = class extends import_obsidian.Modal {
  constructor(app, activeFile, renameFunc, onClose) {
    super(app);
    this.activeFile = activeFile;
    this.renameFunc = renameFunc;
    this.onCloseExtra = onClose;
    this.state = {
      namePattern: '',
      extPattern: '',
      nameReplace: '',
      renameTasks: [],
    };
  }
  onOpen() {
    this.containerEl.addClass('image-rename-modal');
    const { contentEl, titleEl } = this;
    titleEl.setText('Batch rename embeded files');
    const namePatternSetting = new import_obsidian.Setting(contentEl)
      .setName('Name pattern')
      .setDesc('Please input the name pattern to match files (regex)')
      .addText((text) =>
        text.setValue(this.state.namePattern).onChange((value) =>
          __async(this, null, function* () {
            this.state.namePattern = value;
          }),
        ),
      );
    const npInputEl = namePatternSetting.controlEl.children[0];
    npInputEl.focus();
    const npInputState = lockInputMethodComposition(npInputEl);
    npInputEl.addEventListener('keydown', (e) =>
      __async(this, null, function* () {
        if (e.key === 'Enter' && !npInputState.lock) {
          e.preventDefault();
          if (!this.state.namePattern) {
            errorEl.innerText = 'Error: "Name pattern" could not be empty';
            errorEl.style.display = 'block';
            return;
          }
          this.matchImageNames(tbodyEl);
        }
      }),
    );
    const extPatternSetting = new import_obsidian.Setting(contentEl)
      .setName('Extension pattern')
      .setDesc('Please input the extension pattern to match files (regex)')
      .addText((text) =>
        text.setValue(this.state.extPattern).onChange((value) =>
          __async(this, null, function* () {
            this.state.extPattern = value;
          }),
        ),
      );
    const extInputEl = extPatternSetting.controlEl.children[0];
    extInputEl.addEventListener('keydown', (e) =>
      __async(this, null, function* () {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.matchImageNames(tbodyEl);
        }
      }),
    );
    const nameReplaceSetting = new import_obsidian.Setting(contentEl)
      .setName('Name replace')
      .setDesc(
        'Please input the string to replace the matched name (use $1, $2 for regex groups)',
      )
      .addText((text) =>
        text.setValue(this.state.nameReplace).onChange((value) =>
          __async(this, null, function* () {
            this.state.nameReplace = value;
          }),
        ),
      );
    const nrInputEl = nameReplaceSetting.controlEl.children[0];
    const nrInputState = lockInputMethodComposition(nrInputEl);
    nrInputEl.addEventListener('keydown', (e) =>
      __async(this, null, function* () {
        if (e.key === 'Enter' && !nrInputState.lock) {
          e.preventDefault();
          this.matchImageNames(tbodyEl);
        }
      }),
    );
    const matchedContainer = contentEl.createDiv({
      cls: 'matched-container',
    });
    const tableET = createElementTree(matchedContainer, {
      tag: 'table',
      children: [
        {
          tag: 'thead',
          children: [
            {
              tag: 'tr',
              children: [
                {
                  tag: 'td',
                  text: 'Original path',
                },
                {
                  tag: 'td',
                  text: 'Renamed Name',
                },
              ],
            },
          ],
        },
        {
          tag: 'tbody',
        },
      ],
    });
    const tbodyEl = tableET.children[1].el;
    const errorEl = contentEl.createDiv({
      cls: 'error',
      attr: {
        style: 'display: none;',
      },
    });
    new import_obsidian.Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText('Rename all')
          .setClass('mod-cta')
          .onClick(() => {
            new ConfirmModal(
              this.app,
              'Confirm rename all',
              `Are you sure? This will rename all the ${this.state.renameTasks.length} images matched the pattern.`,
              () => {
                this.renameAll();
                this.close();
              },
            ).open();
          });
      })
      .addButton((button) => {
        button.setButtonText('Cancel').onClick(() => {
          this.close();
        });
      });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    this.onCloseExtra();
  }
  renameAll() {
    return __async(this, null, function* () {
      debugLog('renameAll', this.state);
      for (const task of this.state.renameTasks) {
        yield this.renameFunc(task.file, task.name);
      }
    });
  }
  matchImageNames(tbodyEl) {
    const { state } = this;
    const renameTasks = [];
    tbodyEl.empty();
    const fileCache = this.app.metadataCache.getFileCache(this.activeFile);
    if (!fileCache || !fileCache.embeds) return;
    const namePatternRegex = new RegExp(state.namePattern, 'g');
    const extPatternRegex = new RegExp(state.extPattern);
    fileCache.embeds.forEach((embed) => {
      const file = this.app.metadataCache.getFirstLinkpathDest(
        embed.link,
        this.activeFile.path,
      );
      if (!file) {
        console.warn('file not found', embed.link);
        return;
      }
      if (state.extPattern) {
        const m0 = extPatternRegex.exec(file.extension);
        if (!m0) return;
      }
      const stem = file.basename;
      namePatternRegex.lastIndex = 0;
      const m1 = namePatternRegex.exec(stem);
      if (!m1) return;
      let renamedName = file.name;
      if (state.nameReplace) {
        namePatternRegex.lastIndex = 0;
        renamedName = stem.replace(namePatternRegex, state.nameReplace);
        renamedName = `${renamedName}.${file.extension}`;
      }
      renameTasks.push({
        file,
        name: renamedName,
      });
      createElementTree(tbodyEl, {
        tag: 'tr',
        children: [
          {
            tag: 'td',
            children: [
              {
                tag: 'span',
                text: file.name,
              },
              {
                tag: 'div',
                text: file.path,
                attr: {
                  class: 'file-path',
                },
              },
            ],
          },
          {
            tag: 'td',
            children: [
              {
                tag: 'span',
                text: renamedName,
              },
              {
                tag: 'div',
                text: path.join(file.parent.path, renamedName),
                attr: {
                  class: 'file-path',
                },
              },
            ],
          },
        ],
      });
    });
    debugLog('new renameTasks', renameTasks);
    state.renameTasks = renameTasks;
  }
};
var ConfirmModal = class extends import_obsidian.Modal {
  constructor(app, title, message, onConfirm) {
    super(app);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
  }
  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText(this.title);
    contentEl.createEl('p', {
      text: this.message,
    });
    new import_obsidian.Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText('Yes')
          .setClass('mod-warning')
          .onClick(() => {
            this.onConfirm();
            this.close();
          });
      })
      .addButton((button) => {
        button.setButtonText('No').onClick(() => {
          this.close();
        });
      });
  }
};

// src/generators.ts
var getRandomHex = (length, uppercased) => {
  const hex = crypto.getRandomValues(new Uint8Array(length));
  const value = Array.from(hex, (byte) => {
    return (byte & 255).toString(16);
  })
    .join('')
    .substring(0, length);
  return uppercased ? value.toUpperCase() : value;
};
var getRandomUuid = (uppercased, delimiter) => {
  return [
    getRandomHex(8, uppercased),
    getRandomHex(4, uppercased),
    getRandomHex(4, uppercased),
    getRandomHex(4, uppercased),
    getRandomHex(12, uppercased),
  ].join(delimiter);
};

// src/template.ts
var dateTmplRegex = /{{DATE:(.+)}}/gm;
var replaceDateVar = (s, date) => {
  const m = dateTmplRegex.exec(s);
  if (!m) return s;
  return s.replace(m[0], date.format(m[1]));
};
var renderTemplate = (tmpl, data) => {
  const now = window.moment();
  let text = tmpl;
  let newtext;
  while ((newtext = replaceDateVar(text, now)) != text) {
    text = newtext;
  }
  text = text
    .replace(/{{imageNameKey}}/gm, data.imageNameKey)
    .replace(/{{fileName}}/gm, data.fileName)
    .replace(/{{uuid}}/gm, getRandomUuid(true, '-'))
    .replace(/{{hex8}}/gm, getRandomHex(8, true))
    .replace(/{{hex4}}/gm, getRandomHex(4, true))
    .replace(/{{hex12}}/gm, getRandomHex(12, true))
    .replace(/{{hex}}/gm, getRandomHex(6, true));
  return text;
};

// src/main.ts
var DEFAULT_SETTINGS = {
  imageNamePattern: '{{fileName}}',
  dupNumberAtStart: false,
  dupNumberDelimiter: '-',
  autoRename: false,
  handleAllAttachments: false,
  excludeExtensionPattern: '',
  disableRenameNotice: false,
};
var PASTED_IMAGE_PREFIX = 'Pasted image ';
var PasteImageRenamePlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.modals = [];
  }
  onload() {
    return __async(this, null, function* () {
      const pkg = require_package();
      console.log(`Plugin loading: ${pkg.name} ${pkg.version}`);
      yield this.loadSettings();
      this.registerEvent(
        this.app.vault.on('create', (file) => {
          if (!(file instanceof import_obsidian2.TFile)) return;
          const timeGapMs = new Date().getTime() - file.stat.ctime;
          if (timeGapMs > 1e3) return;
          if (isMarkdownFile(file)) return;
          if (isPastedImage(file)) {
            debugLog('pasted image created', file);
            this.startRenameProcess(file, this.settings.autoRename);
          } else {
            if (this.settings.handleAllAttachments) {
              debugLog('file created', file);
              if (this.testExcludeExtensionRegex(file)) {
                debugLog('excluded file by ext', file);
                return;
              }
              this.startRenameProcess(file, this.settings.autoRename);
            }
          }
        }),
      );
      const startBatchRenameProcess = () => {
        this.openBatchRenameModal();
      };
      this.addCommand({
        id: 'batch-rename-embeded-files',
        name: 'Batch rename embeded files (in the current file)',
        callback: startBatchRenameProcess,
      });
      if (DEBUG) {
        this.addRibbonIcon(
          'wand-glyph',
          'Batch rename embeded files',
          startBatchRenameProcess,
        );
      }
      const batchRenameAllImages = () => {
        this.batchRenameAllImages();
      };
      this.addCommand({
        id: 'batch-rename-all-images',
        name: 'Batch rename all images instantly (in the current file)',
        callback: batchRenameAllImages,
      });
      if (DEBUG) {
        this.addRibbonIcon(
          'wand-glyph',
          'Batch rename all images instantly (in the current file)',
          batchRenameAllImages,
        );
      }
      this.addSettingTab(new SettingTab(this.app, this));
    });
  }
  startRenameProcess(file, autoRename = false) {
    return __async(this, null, function* () {
      const activeFile = this.getActiveFile();
      if (!activeFile) {
        new import_obsidian2.Notice('Error: No active file found.');
        return;
      }
      const { stem, newName, isMeaningful } = this.generateNewName(
        file,
        activeFile,
      );
      debugLog('generated newName:', newName, isMeaningful);
      if (!isMeaningful || !autoRename) {
        this.openRenameModal(file, isMeaningful ? stem : '', activeFile.path);
        return;
      }
      this.renameFile(file, newName, activeFile.path, true);
    });
  }
  renameFile(file, inputNewName, sourcePath, replaceCurrentLine) {
    return __async(this, null, function* () {
      const { name: newName, stem: newNameStem } =
        yield this.deduplicateNewName(inputNewName, file);
      debugLog('deduplicated newName:', newName);
      const originName = file.name;
      const originStem = file.basename;
      const ext = file.extension;
      const vaultConfig = getVaultConfig(this.app);
      let useMarkdownLinks = false;
      if (vaultConfig && vaultConfig.useMarkdownLinks) {
        useMarkdownLinks = true;
      }
      const newPath = path.join(file.parent.path, newName);
      try {
        yield this.app.fileManager.renameFile(file, newPath);
      } catch (err) {
        new import_obsidian2.Notice(`Failed to rename ${newName}: ${err}`);
        throw err;
      }
      if (!replaceCurrentLine) {
        return;
      }
      let linkTextRegex, newLinkText;
      if (useMarkdownLinks) {
        linkTextRegex = new RegExp(
          '!\\[\\]\\(([^[\\]]*\\/)?${originStem}\\.${ext}\\)',
        );
        newLinkText = `![]($1${newNameStem}.${ext}])`;
      } else {
        linkTextRegex = new RegExp(
          `!\\[\\[([^[\\]]*\\/)?${originStem}\\.${ext}\\]\\]`,
        );
        newLinkText = `![[$1${newNameStem}.${ext}]]`;
      }
      debugLog('replace text', linkTextRegex, newLinkText);
      const editor = this.getActiveEditor();
      if (!editor) {
        new import_obsidian2.Notice(
          `Failed to rename ${newName}: no active editor`,
        );
        return;
      }
      const cursor = editor.getCursor();
      const line = editor.getLine(cursor.line);
      const replacedLine = line.replace(linkTextRegex, newLinkText);
      debugLog('current line -> replaced line', line, replacedLine);
      editor.transaction({
        changes: [
          {
            from: __spreadProps(__spreadValues({}, cursor), {
              ch: 0,
            }),
            to: __spreadProps(__spreadValues({}, cursor), {
              ch: line.length,
            }),
            text: replacedLine,
          },
        ],
      });
      if (!this.settings.disableRenameNotice) {
        new import_obsidian2.Notice(`Renamed ${originName} to ${newName}`);
      }
    });
  }
  openRenameModal(file, newName, sourcePath) {
    const modal = new ImageRenameModal(
      this.app,
      file,
      newName,
      (confirmedName) => {
        debugLog('confirmedName:', confirmedName);
        this.renameFile(file, confirmedName, sourcePath, true);
      },
      () => {
        this.modals.splice(this.modals.indexOf(modal), 1);
      },
    );
    this.modals.push(modal);
    modal.open();
    debugLog('modals count', this.modals.length);
  }
  openBatchRenameModal() {
    const activeFile = this.getActiveFile();
    const modal = new ImageBatchRenameModal(
      this.app,
      activeFile,
      (file, name) =>
        __async(this, null, function* () {
          yield this.renameFile(file, name, activeFile.path);
        }),
      () => {
        this.modals.splice(this.modals.indexOf(modal), 1);
      },
    );
    this.modals.push(modal);
    modal.open();
  }
  batchRenameAllImages() {
    return __async(this, null, function* () {
      const activeFile = this.getActiveFile();
      const fileCache = this.app.metadataCache.getFileCache(activeFile);
      if (!fileCache || !fileCache.embeds) return;
      const extPatternRegex = /jpe?g|png|gif|tiff|webp/i;
      for (const embed of fileCache.embeds) {
        const file = this.app.metadataCache.getFirstLinkpathDest(
          embed.link,
          activeFile.path,
        );
        if (!file) {
          console.warn('file not found', embed.link);
          return;
        }
        const m0 = extPatternRegex.exec(file.extension);
        if (!m0) return;
        const { newName, isMeaningful } = this.generateNewName(
          file,
          activeFile,
        );
        debugLog('generated newName:', newName, isMeaningful);
        if (!isMeaningful) {
          new import_obsidian2.Notice(
            'Failed to batch rename images: the generated name is not meaningful',
          );
          break;
        }
        yield this.renameFile(file, newName, activeFile.path, false);
      }
    });
  }
  generateNewName(file, activeFile) {
    var _a;
    let imageNameKey = '';
    const fileCache = this.app.metadataCache.getFileCache(activeFile);
    if (fileCache) {
      debugLog('frontmatter', fileCache.frontmatter);
      imageNameKey =
        ((_a = fileCache.frontmatter) == null ? void 0 : _a.imageNameKey) || '';
    } else {
      console.warn(
        'could not get file cache from active file',
        activeFile.name,
      );
    }
    const stem = renderTemplate(this.settings.imageNamePattern, {
      imageNameKey,
      fileName: activeFile.basename,
    });
    const meaninglessRegex = new RegExp(
      `[${this.settings.dupNumberDelimiter}s]`,
      'gm',
    );
    return {
      stem,
      newName: stem + '.' + file.extension,
      isMeaningful: stem.replace(meaninglessRegex, '') !== '',
    };
  }
  deduplicateNewName(newName, file) {
    return __async(this, null, function* () {
      const dir = file.parent.path;
      const listed = yield this.app.vault.adapter.list(dir);
      debugLog('sibling files', listed);
      const newNameExt = path.extension(newName),
        newNameStem = newName.slice(0, newName.length - newNameExt.length - 1),
        newNameStemEscaped = escapeRegExp(newNameStem),
        delimiter = this.settings.dupNumberDelimiter,
        delimiterEscaped = escapeRegExp(delimiter);
      let dupNameRegex;
      if (this.settings.dupNumberAtStart) {
        dupNameRegex = new RegExp(
          `^(?<number>\\d+)${delimiterEscaped}(?<name>${newNameStemEscaped})\\.${newNameExt}$`,
        );
      } else {
        dupNameRegex = new RegExp(
          `^(?<name>${newNameStemEscaped})${delimiterEscaped}(?<number>\\d+)\\.${newNameExt}$`,
        );
      }
      debugLog('dupNameRegex', dupNameRegex);
      const dupNameNumbers = [];
      let isNewNameExist = false;
      for (let sibling of listed.files) {
        sibling = path.basename(sibling);
        if (sibling == newName) {
          isNewNameExist = true;
          continue;
        }
        const m = dupNameRegex.exec(sibling);
        if (!m) continue;
        dupNameNumbers.push(parseInt(m.groups.number));
      }
      if (isNewNameExist) {
        const newNumber =
          dupNameNumbers.length > 0 ? Math.max(...dupNameNumbers) + 1 : 1;
        if (this.settings.dupNumberAtStart) {
          newName = `${newNumber}${delimiter}${newNameStem}.${newNameExt}`;
        } else {
          newName = `${newNameStem}${delimiter}${newNumber}.${newNameExt}`;
        }
      }
      return {
        name: newName,
        stem: newName.slice(0, newName.length - newNameExt.length - 1),
        extension: newNameExt,
      };
    });
  }
  getActiveFile() {
    const view = this.app.workspace.getActiveViewOfType(
      import_obsidian2.MarkdownView,
    );
    const file = view == null ? void 0 : view.file;
    debugLog('active file', file == null ? void 0 : file.path);
    return file;
  }
  getActiveEditor() {
    const view = this.app.workspace.getActiveViewOfType(
      import_obsidian2.MarkdownView,
    );
    return view == null ? void 0 : view.editor;
  }
  onunload() {
    this.modals.map((modal) => modal.close());
  }
  buildExcludeExtensionRegex() {
    this.excludeExtensionRegex = new RegExp(
      this.settings.excludeExtensionPattern,
    );
  }
  testExcludeExtensionRegex(file) {
    if (!this.excludeExtensionRegex) {
      this.buildExcludeExtensionRegex();
    }
    return this.excludeExtensionRegex.test(file.extension);
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        yield this.loadData(),
      );
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
function isPastedImage(file) {
  if (file instanceof import_obsidian2.TFile) {
    if (file.name.startsWith(PASTED_IMAGE_PREFIX)) {
      return true;
    }
  }
  return false;
}
function isMarkdownFile(file) {
  if (file instanceof import_obsidian2.TFile) {
    if (file.extension === 'md') {
      return true;
    }
  }
  return false;
}
var ImageRenameModal = class extends import_obsidian2.Modal {
  constructor(app, src, stem, renameFunc, onClose) {
    super(app);
    this.src = src;
    this.stem = stem;
    this.renameFunc = renameFunc;
    this.onCloseExtra = onClose;
  }
  onOpen() {
    this.containerEl.addClass('image-rename-modal');
    const { contentEl, titleEl } = this;
    titleEl.setText('Rename image');
    const imageContainer = contentEl.createDiv({
      cls: 'image-container',
    });
    imageContainer.createEl('img', {
      attr: {
        src: this.app.vault.getResourcePath(this.src),
      },
    });
    let stem = this.stem;
    const ext = this.src.extension;
    const getNewName = (stem2) => stem2 + '.' + ext;
    const getNewPath = (stem2) =>
      path.join(this.src.parent.path, getNewName(stem2));
    const infoET = createElementTree(contentEl, {
      tag: 'ul',
      cls: 'info',
      children: [
        {
          tag: 'li',
          children: [
            {
              tag: 'span',
              text: 'Origin path',
            },
            {
              tag: 'span',
              text: this.src.path,
            },
          ],
        },
        {
          tag: 'li',
          children: [
            {
              tag: 'span',
              text: 'New path',
            },
            {
              tag: 'span',
              text: getNewPath(stem),
            },
          ],
        },
      ],
    });
    const doRename = () =>
      __async(this, null, function* () {
        debugLog('doRename', `stem=${stem}`);
        this.renameFunc(getNewName(stem));
      });
    const nameSetting = new import_obsidian2.Setting(contentEl)
      .setName('New name')
      .setDesc('Please input the new name for the image (without extension)')
      .addText((text) =>
        text.setValue(stem).onChange((value) =>
          __async(this, null, function* () {
            stem = sanitizer.filename(value);
            infoET.children[1].children[1].el.innerText = getNewPath(stem);
          }),
        ),
      );
    const nameInputEl = nameSetting.controlEl.children[0];
    nameInputEl.focus();
    const nameInputState = lockInputMethodComposition(nameInputEl);
    nameInputEl.addEventListener('keydown', (e) =>
      __async(this, null, function* () {
        if (e.key === 'Enter' && !nameInputState.lock) {
          e.preventDefault();
          if (!stem) {
            errorEl.innerText = 'Error: "New name" could not be empty';
            errorEl.style.display = 'block';
            return;
          }
          doRename();
          this.close();
        }
      }),
    );
    const errorEl = contentEl.createDiv({
      cls: 'error',
      attr: {
        style: 'display: none;',
      },
    });
    new import_obsidian2.Setting(contentEl)
      .addButton((button) => {
        button.setButtonText('Rename').onClick(() => {
          doRename();
          this.close();
        });
      })
      .addButton((button) => {
        button.setButtonText('Cancel').onClick(() => {
          this.close();
        });
      });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    this.onCloseExtra();
  }
};
var imageNamePatternDesc = `
The pattern indicates how the new name should be generated.

Available variables:
- {{fileName}}: name of the active file, without ".md" extension.
- {{imageNameKey}}: this variable is read from the markdown file's frontmatter, from the same key "imageNameKey".
- {{DATE:$FORMAT}}: use "$FORMAT" to format the current date, "$FORMAT" must be a Moment.js format string, e.g. {{DATE:YYYY-MM-DD}}.

Here are some examples from pattern to image names (repeat in sequence), variables: fileName = "My note", imageNameKey = "foo":
- {{fileName}}: My note, My note-1, My note-2
- {{imageNameKey}}: foo, foo-1, foo-2
- {{imageNameKey}}-{{DATE:YYYYMMDD}}: foo-20220408, foo-20220408-1, foo-20220408-2
`;
var SettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian2.Setting(containerEl)
      .setName('Image name pattern')
      .setDesc(imageNamePatternDesc)
      .setClass('long-description-setting-item')
      .addText((text) =>
        text
          .setPlaceholder('{{imageNameKey}}')
          .setValue(this.plugin.settings.imageNamePattern)
          .onChange((value) =>
            __async(this, null, function* () {
              this.plugin.settings.imageNamePattern = value;
              yield this.plugin.saveSettings();
            }),
          ),
      );
    new import_obsidian2.Setting(containerEl)
      .setName('Duplicate number at start (or end)')
      .setDesc(
        `If enabled, duplicate number will be added at the start as prefix for the image name, otherwise it will be added at the end as suffix for the image name.`,
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.dupNumberAtStart)
          .onChange((value) =>
            __async(this, null, function* () {
              this.plugin.settings.dupNumberAtStart = value;
              yield this.plugin.saveSettings();
            }),
          ),
      );
    new import_obsidian2.Setting(containerEl)
      .setName('Duplicate number delimiter')
      .setDesc(
        `The delimiter to generate the number prefix/suffix for duplicated names. For example, if the value is "-", the suffix will be like "-1", "-2", "-3", and the prefix will be like "1-", "2-", "3-". Only characters that are valid in file names are allowed.`,
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.dupNumberDelimiter)
          .onChange((value) =>
            __async(this, null, function* () {
              this.plugin.settings.dupNumberDelimiter =
                sanitizer.delimiter(value);
              yield this.plugin.saveSettings();
            }),
          ),
      );
    new import_obsidian2.Setting(containerEl)
      .setName('Auto rename')
      .setDesc(
        `By default, the rename modal will always be shown to confirm before renaming, if this option is set, the image will be auto renamed after pasting.`,
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoRename).onChange((value) =>
          __async(this, null, function* () {
            this.plugin.settings.autoRename = value;
            yield this.plugin.saveSettings();
          }),
        ),
      );
    new import_obsidian2.Setting(containerEl)
      .setName('Handle all attachments')
      .setDesc(
        `By default, the plugin only handles images that starts with "Pasted image " in name,
			which is the prefix Obsidian uses to create images from pasted content.
			If this option is set, the plugin will handle all attachments that are created in the valut.`,
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.handleAllAttachments)
          .onChange((value) =>
            __async(this, null, function* () {
              this.plugin.settings.handleAllAttachments = value;
              yield this.plugin.saveSettings();
            }),
          ),
      );
    new import_obsidian2.Setting(containerEl)
      .setName('Exclude extension pattern')
      .setDesc(
        `This option is only useful when "Handle all attachments" is enabled.
			Write a Regex pattern to exclude certain extensions from being handled. Only the first line will be used.`,
      )
      .setClass('single-line-textarea')
      .addTextArea((text) =>
        text
          .setPlaceholder('docx?|xlsx?|pptx?|zip|rar')
          .setValue(this.plugin.settings.excludeExtensionPattern)
          .onChange((value) =>
            __async(this, null, function* () {
              this.plugin.settings.excludeExtensionPattern = value;
              yield this.plugin.saveSettings();
              this.plugin.buildExcludeExtensionRegex();
            }),
          ),
      );
    new import_obsidian2.Setting(containerEl)
      .setName('Disable rename notice')
      .setDesc(
        `Turn off this option if you don't want to see the notice when renaming images.
			Note that Obsidian may display a notice when a link has changed, this option cannot disable that.`,
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.disableRenameNotice)
          .onChange((value) =>
            __async(this, null, function* () {
              this.plugin.settings.disableRenameNotice = value;
              yield this.plugin.saveSettings();
            }),
          ),
      );
  }
};
