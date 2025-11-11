(function () {
  const properties = [
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius'
  ];

  const zeroElement = (element) => {
    if (!(element instanceof Element)) {
      return;
    }
    for (const property of properties) {
      element.style.setProperty(property, '0', 'important');
    }
  };

  const zeroTree = (node) => {
    if (!node) {
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      zeroElement(node);
    }
    const descendants = node.querySelectorAll ? node.querySelectorAll('*') : [];
    for (const element of descendants) {
      zeroElement(element);
    }
  };

  const handleMutations = (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            zeroTree(node);
          }
        });
      } else if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        zeroElement(mutation.target);
      }
    }
  };

  const init = () => {
    if (!document.documentElement) {
      return;
    }
    zeroTree(document.documentElement);
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
