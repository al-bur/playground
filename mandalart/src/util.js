const deepClone = (original) => {
  const shallowCloned = [...original];

  shallowCloned.forEach((arr, index) => {
    if (Array.isArray(arr)) {
      shallowCloned[index] = [...arr];
    }
  });

  return shallowCloned;
};

export { deepClone };
