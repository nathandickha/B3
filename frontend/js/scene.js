function getSpaWallThroatClipBox(poolGroup, spaGroup, pad = 0.01) {
  if (!poolGroup || !spaGroup) return null;

  const bounds = getPoolFootprintBoundsWorld(poolGroup);
  if (!bounds) return null;

  spaGroup.updateMatrixWorld?.(true);
  const center = new THREE.Vector3();
  spaGroup.getWorldPosition(center);

  const halfX = Math.max(0.005, (spaGroup.userData?.spaLength || 0.01) * 0.5);
  const halfY = Math.max(0.005, (spaGroup.userData?.spaWidth || 0.01) * 0.5);
  const snapSide = spaGroup?.userData?.snapSide || null;

  const insidePad = 0.03 + SPA_THROAT_WIDTH_EXTRA + pad;
  const outsideDepth = 0.28 + SPA_THROAT_WIDTH_EXTRA + pad;
  const alongPad = SPA_THROAT_ALONG_PAD + pad;

  // 🔥 CONTROL THIS VALUE
  const extraAlongWall = 0.10; // 100mm (increase if needed)

  let minX = center.x - halfX;
  let maxX = center.x + halfX;
  let minY = center.y - halfY;
  let maxY = center.y + halfY;

  if (snapSide === 'left') {
    // depth (unchanged)
    minX = bounds.minX - outsideDepth;
    maxX = bounds.minX + insidePad;

    // ✅ grow along wall (Y axis ONLY)
    minY = center.y - halfY - alongPad - extraAlongWall;
    maxY = center.y + halfY + alongPad + extraAlongWall;

  } else if (snapSide === 'right') {
    minX = bounds.maxX - insidePad;
    maxX = bounds.maxX + outsideDepth;

    // ✅ grow along wall (Y axis ONLY)
    minY = center.y - halfY - alongPad - extraAlongWall;
    maxY = center.y + halfY + alongPad + extraAlongWall;

  } else if (snapSide === 'front') {
    minY = bounds.minY - outsideDepth;
    maxY = bounds.minY + insidePad;

    // ✅ grow along wall (X axis ONLY)
    minX = center.x - halfX - alongPad - extraAlongWall;
    maxX = center.x + halfX + alongPad + extraAlongWall;

  } else if (snapSide === 'back') {
    minY = bounds.maxY - insidePad;
    maxY = bounds.maxY + outsideDepth;

    // ✅ grow along wall (X axis ONLY)
    minX = center.x - halfX - alongPad - extraAlongWall;
    maxX = center.x + halfX + alongPad + extraAlongWall;

  } else {
    return null;
  }

  return { minX, maxX, minY, maxY };
}
