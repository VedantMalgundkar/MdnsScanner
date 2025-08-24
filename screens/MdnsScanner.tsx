import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Zeroconf from 'react-native-zeroconf';
import HyperhdrDiscoveryTile,{ HyperhdrDevice } from '../components/HyperhdrDiscoveryTile';

const zeroconf = new Zeroconf();

export default function MdnsScanner() {
  const [services, setServices] = useState<Record<string, HyperhdrDevice>>({});

  useEffect(() => {
    zeroconf.on('start', () => console.log('🔍 Scanning started'));
    zeroconf.on('found', (name) => console.log('✅ Found service:', name));
    zeroconf.on('resolved', (service: HyperhdrDevice) => {
      console.log('📡 Resolved service:', service);
      setServices(prev => ({ ...prev, [service.name]: service }));
    });
    zeroconf.on('error', err => console.error('❌ Error:', err));
    zeroconf.on('stop', () => console.log('🛑 Scan stopped'));

    zeroconf.scan('hyperhdr', 'tcp', 'local.');

    return () => {
      zeroconf.stop();
      zeroconf.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>mDNS HyperHDR Scanner</Text>
      <FlatList
        data={Object.values(services)}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <HyperhdrDiscoveryTile device={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
