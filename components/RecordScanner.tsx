import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";

export default function RecordScanner({ onScan }): JSX.Element {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    async function getBarCodeScannerPermissions() {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  function handleBarCodeScanned(result: BarCodeScannerResult) {
    setScanned(true);
    onScan(result.data);
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 300 }}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
      />
    </>
  );
}
