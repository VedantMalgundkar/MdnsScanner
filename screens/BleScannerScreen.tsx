import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

const BLEScanner = () => {
  const [devices, setDevices] = useState({});
  const [scanning, setScanning] = useState(false);
  const [manager, setManager] = useState<BleManager | null>(null);

  useEffect(() => {
    const bleManager = new BleManager();
    setManager(bleManager);

    return () => {
      bleManager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };

  const startScan = async () => {
    if (!manager) return;

    await requestPermissions();
    setDevices({});
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error:", error);
        setScanning(false);
        return;
      }

      if (device && device.name) {
        setDevices(prev => ({ ...prev, [device.id]: device }));
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: scanning ? "gray" : "blue",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={startScan}
        disabled={scanning}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {scanning ? "Scanning..." : "Start Scan"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={Object.values(devices)}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <View style={{ padding: 10, marginBottom: 5, backgroundColor: "#f0f0f0", borderRadius: 6 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name || "Unnamed Device"}</Text>
            <Text>ID: {item.id}</Text>
            <Text>RSSI: {item.rssi}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BLEScanner;
