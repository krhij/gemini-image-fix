(function() {
  'use strict';

  function generateUniqueName(originalName, mimeType) {
    const ext = (mimeType && mimeType.split('/')[1]) || originalName.split('.').pop() || 'png';
    return `screen_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
  }

  try {
    // 1. Przechwycenie pobierania pliku ze schowka (DataTransferItem.getAsFile)
    if (typeof DataTransferItem !== 'undefined' && DataTransferItem.prototype.getAsFile) {
      const origGetAsFile = DataTransferItem.prototype.getAsFile;
      DataTransferItem.prototype.getAsFile = function() {
        const file = origGetAsFile.apply(this, arguments);
        if (file && typeof file.name === 'string') {
          const lower = file.name.toLowerCase();
          if (lower === 'obraz.png' || lower === 'image.png') {
            const uniqueName = generateUniqueName(file.name, file.type);
            return new File([file], uniqueName, {
              type: file.type || 'image/png',
              lastModified: Date.now()
            });
          }
        }
        return file;
      };
    }

    // 2. Zabezpieczenie gettera nazwy obiektu File
    const origNameDesc = Object.getOwnPropertyDescriptor(File.prototype, 'name');
    if (origNameDesc && origNameDesc.get) {
      Object.defineProperty(File.prototype, 'name', {
        get() {
          const original = origNameDesc.get.call(this);
          if (typeof original === 'string') {
            const lower = original.toLowerCase();
            if (lower === 'obraz.png' || lower === 'image.png') {
              if (!this._geminiUniqueName) {
                this._geminiUniqueName = generateUniqueName(original, this.type);
              }
              return this._geminiUniqueName;
            }
          }
          return original;
        },
        configurable: true,
        enumerable: true
      });
    }

    // 3. Zabezpieczenie wysyłki formularza (FormData.append)
    const origAppend = FormData.prototype.append;
    FormData.prototype.append = function(name, value, filename) {
      if (value instanceof File && !filename) {
        return origAppend.call(this, name, value, value.name);
      }
      return origAppend.apply(this, arguments);
    };
  } catch (err) {
    console.error('[Gemini Screenshot Renamer] Błąd:', err);
  }
})();