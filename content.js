let isFixing = false;

window.addEventListener('paste', (e) => {
  if (isFixing) return;

  const clipboardData = e.clipboardData;
  if (!clipboardData || !clipboardData.items) return;

  let hasRenamed = false;
  const newDt = new DataTransfer();

  for (let i = 0; i < clipboardData.items.length; i++) {
    const item = clipboardData.items[i];
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file && (file.type.startsWith('image/') || file.name === 'obraz.png' || file.name === 'image.png')) {
        const ext = (file.type && file.type.split('/')[1]) || 'png';
        const uniqueName = `screen_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
        const renamedFile = new File([file], uniqueName, {
          type: file.type || 'image/png',
          lastModified: Date.now()
        });
        newDt.items.add(renamedFile);
        hasRenamed = true;
      } else if (file) {
        newDt.items.add(file);
      }
    } else if (item.kind === 'string') {
      newDt.setData(item.type, clipboardData.getData(item.type));
    }
  }

  if (hasRenamed) {
    e.preventDefault();
    e.stopImmediatePropagation();

    isFixing = true;
    const target = e.target || document.activeElement || document.body;
    const newPasteEvent = new ClipboardEvent('paste', {
      clipboardData: newDt,
      bubbles: true,
      cancelable: true,
      composed: true
    });

    target.dispatchEvent(newPasteEvent);
    isFixing = false;
  }
}, true);