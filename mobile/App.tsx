import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { fetchBootstrap, login } from './src/api';

export default function App() {
  const [email, setEmail] = useState('alex@aios.app');
  const [password, setPassword] = useState('demo1234');
  const [token, setToken] = useState('');
  const [bootstrap, setBootstrap] = useState<Awaited<ReturnType<typeof fetchBootstrap>> | null>(null);
  const [busy, setBusy] = useState(false);
  const nextTask = useMemo(
    () => bootstrap?.tasks.find((task) => !task.completed) || null,
    [bootstrap],
  );

  const handleLogin = async () => {
    setBusy(true);
    try {
      const session = await login(email, password);
      setToken(session.token);
      const nextBootstrap = await fetchBootstrap(session.token);
      setBootstrap(nextBootstrap);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5FAF5' }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={{ backgroundColor: '#222222', borderRadius: 28, padding: 22 }}>
          <Text style={{ color: '#C2DBC4', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            AIOS Mobile
          </Text>
          <Text style={{ color: 'white', fontSize: 28, fontWeight: '700', marginTop: 10 }}>
            Your all-in-one life assistant on the go.
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', marginTop: 10, fontSize: 14 }}>
            This Expo workspace shares the same backend and demo accounts as the web app.
          </Text>
        </View>

        {!bootstrap ? (
          <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 18, gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#222222' }}>Mobile Login</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{ backgroundColor: '#F5FAF5', borderRadius: 18, padding: 14 }}
              placeholder="Email"
              autoCapitalize="none"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={{ backgroundColor: '#F5FAF5', borderRadius: 18, padding: 14 }}
              placeholder="Password"
              secureTextEntry
            />
            <Pressable
              onPress={() => void handleLogin()}
              style={{ backgroundColor: '#222222', borderRadius: 18, padding: 14, alignItems: 'center' }}
            >
              {busy ? (
                <ActivityIndicator color="#C2DBC4" />
              ) : (
                <Text style={{ color: 'white', fontWeight: '700' }}>Login with demo account</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 18, gap: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#222222' }}>
                Good to see you, {bootstrap.profile.firstName}
              </Text>
              <Text style={{ color: '#666666' }}>
                Mood: {bootstrap.mood} • {bootstrap.health.stepsToday}/{bootstrap.health.stepGoal} steps • {bootstrap.health.waterGlasses}/{bootstrap.health.waterGoal} water
              </Text>
              {nextTask ? (
                <View style={{ backgroundColor: '#F5FAF5', borderRadius: 18, padding: 14 }}>
                  <Text style={{ fontWeight: '700', color: '#222222' }}>Next focus</Text>
                  <Text style={{ marginTop: 4, color: '#666666' }}>{nextTask.title}</Text>
                </View>
              ) : null}
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 18, gap: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#222222' }}>Live Orders</Text>
              {bootstrap.orders.map((order) => (
                <View key={order.id} style={{ backgroundColor: '#F5FAF5', borderRadius: 18, padding: 14 }}>
                  <Text style={{ fontWeight: '700', color: '#222222' }}>{order.vendorName}</Text>
                  <Text style={{ color: '#666666', marginTop: 4 }}>
                    {order.status} • {order.etaLabel}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ color: '#777777', fontSize: 12 }}>
              Token length: {token.length} • Point the app to your reachable backend host when testing on a physical device.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
