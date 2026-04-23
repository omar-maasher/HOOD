import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';

WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function LoginScreen() {
  useWarmUpBrowser();
  
  const { signIn, isLoaded, setActive } = useSignIn();
  
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!isLoaded || !email || !password) return;
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password: password,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        console.warn('Login not complete:', result);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('فشل تسجيل الدخول: ' + (error.errors?.[0]?.longMessage || 'تحقق من بياناتك.'));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (strategy: 'google' | 'facebook') => {
    if (!isLoaded) return;
    setOauthLoading(strategy);
    try {
        const flow = strategy === 'google' ? startGoogleOAuthFlow : startFacebookOAuthFlow;
      
        const { createdSessionId, setActive: setOAuthActive } = await flow({
          redirectUrl: Linking.createURL('/', { scheme: 'mobile' }),
        });

      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
    } finally {
      setOauthLoading(null);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff5e21" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo_hood.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>هود لإدارة الأعمال</Text>
          <Text style={styles.subtitle}>أهلاً بك مجدداً، سجّل دخولك للمتابعة</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput 
              style={styles.input} 
              placeholder="example@mail.com" 
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>كلمة المرور</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, (loading || !!oauthLoading) && styles.buttonDisabled]} 
            onPress={handleLogin} 
            activeOpacity={0.8} 
            disabled={loading || !!oauthLoading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تسجيل الدخول</Text>}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو عبر</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauthContainer}>
            <TouchableOpacity 
              style={styles.oauthButton} 
              onPress={() => handleOAuth('google')} 
              disabled={loading || !!oauthLoading}
            >
              {oauthLoading === 'google' ? (
                  <ActivityIndicator color="#6366f1" />
              ) : (
                  <FontAwesome name="google" size={24} color="#ef4444" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.oauthButton} 
              onPress={() => handleOAuth('facebook')} 
              disabled={loading || !!oauthLoading}
            >
              {oauthLoading === 'facebook' ? (
                  <ActivityIndicator color="#6366f1" />
              ) : (
                  <FontAwesome name="facebook" size={24} color="#1d4ed8" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerText}>
          {new Date().getFullYear()} © جميع الحقوق محفوظة لهود
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a'
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'right',
    marginRight: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    padding: 18,
    borderRadius: 16,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
    textAlign: 'right'
  },
  button: {
    backgroundColor: '#ff5e21', // Hood Orange
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#ff5e21',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  oauthButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  footerText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  }
});
