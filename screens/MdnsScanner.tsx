import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Zeroconf from 'react-native-zeroconf';

const zeroconf = new Zeroconf();

export default function MdnsScanner() {
  const [services, setServices] = useState({});

  useEffect(() => {
    zeroconf.on('start', () => console.log('🔍 Scanning started'));
    zeroconf.on('found', (name) => console.log('✅ Found service:', name));
    zeroconf.on('resolved', (service) => {
      console.log('📡 Resolved service:', service);
      setServices(prev => ({ ...prev, [service.name]: service }));
    });
    zeroconf.on('error', err => console.error('❌ Error:', err));
    zeroconf.on('stop', () => console.log('🛑 Scan stopped'));

    // start scanning for _hyperhdr._tcp.local
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
        keyExtractor={(item:any) => item.name}
        renderItem={({ item }:any) => (
          <View style={styles.item}>
            <Text>Name: {item.name}</Text>
            <Text>Host: {item.host}</Text>
            <Text>IP: {item.addresses?.[0]}</Text>
            <Text>Port: {item.port}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});
