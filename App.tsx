import { useEffect, useState } from 'react' // Add useState and useEffect
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, ImageBackground } from 'react-native'
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Button,
  TextInput,
  Text,
  Card,
} from 'react-native-paper'
import Flag from 'react-native-flags'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
}

export default function App() {
  const [ars, setArs] = useState('') // State for ARS
  const [usd, setUsd] = useState('') // State for USD
  const [ils, setIls] = useState('') // State for ILS
  const [arsToBlueRate, setArsToBlueRate] = useState(0) // State for ARS to Blue rate
  const [exchangeRates, setExchangeRates] = useState({ ars: 0, usd: 0, ils: 0 }) // Store exchange rates

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/ARS'
        )
        const dolarBlue = await fetch('https://api.bluelytics.com.ar/v2/latest')
        const dolarBlueData = await dolarBlue.json()
        const data = await response.json()
        const arsToBlueRate =
          dolarBlueData.oficial.value_avg / dolarBlueData.blue.value_avg

        setArsToBlueRate(arsToBlueRate)
        const dolarBlueValue = dolarBlueData.blue.value_avg
        setArs(dolarBlueValue)
        setExchangeRates({
          ars: data.rates.ARS,
          usd: data.rates.USD,
          ils: data.rates.ILS,
        }) // Set exchange rates
        // Handle the fetched data as needed
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }

    fetchExchangeRates()
  }, []) // Fetch on component mount

  const handleArsChange = (value: string) => {
    const arsValue = parseFloat(value) || 0
    setArs(value)
    console.log(exchangeRates)
    setUsd((arsValue * arsToBlueRate * exchangeRates.usd).toFixed(2).toString()) // Convert ARS to USD and ensure it's a string
    setIls((arsValue * arsToBlueRate * exchangeRates.ils).toFixed(2).toString()) // Convert ARS to ILS and ensure it's a string
  }

  const handleUsdChange = (value: string) => {
    const usdValue = parseFloat(value) || 0
    setUsd(value)
    setArs((usdValue / exchangeRates.usd / arsToBlueRate).toFixed(2).toString()) // Convert USD to ARS and ensure it's a string
    setIls(
      ((usdValue / exchangeRates.usd) * exchangeRates.ils).toFixed(2).toString()
    )
  }

  const handleIlsChange = (value: string) => {
    const ilsValue = parseFloat(value) || 0
    setIls(value)
    setArs((ilsValue / exchangeRates.ils / arsToBlueRate).toFixed(2).toString()) // Convert ILS to ARS and ensure it's a string
    setUsd(
      ((ilsValue / exchangeRates.ils) * exchangeRates.usd).toFixed(2).toString()
    ) // Convert ILS to USD and ensure it's a string
  }

  const resetValues = () => {
    setArs('')
    setUsd('')
    setIls('')
  }

  return (
    <PaperProvider theme={theme}>
      <ImageBackground
        source={require('./assets/arg_israel.jpeg')}
        style={styles.background}
      >
        <Card style={styles.container}>
          <View style={styles.flagContainer}>
            <Flag code="AR" size={32} type="flat" />
            <Text variant="titleMedium" style={styles.text}>
              ARS (Dollar Blue):
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={ars}
            mode="outlined"
            onChangeText={handleArsChange} // Update ARS state
          />
          <View style={styles.flagContainer}>
            <Flag code="US" size={32} type="flat" />
            <Text variant="titleMedium" style={styles.text}>
              USD (US Dollar):
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={usd}
            mode="outlined"
            onChangeText={handleUsdChange} // Update USD state
          />
          <View style={styles.flagContainer}>
            <Flag code="IL" size={32} type="flat" />
            <Text variant="titleMedium" style={styles.text}>
              ILS (New Israeli Shekel):
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={ils}
            mode="outlined"
            onChangeText={handleIlsChange} // Update ILS state
          />
          <Button
            children="Reset"
            mode="contained"
            style={styles.button}
            icon="backspace"
            onPress={resetValues}
          />
          <StatusBar style="auto" />
        </Card>
      </ImageBackground>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  button: {
    margin: 10,
  },
  background: {
    flex: 1, // Make sure the background covers the entire screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  input: {
    fontSize: 28,
    borderColor: 'black',
    width: 270,
    margin: 10,
    // height: 40,
    maxWidth: 270,
    textAlign: 'center',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 18,
    margin: 10,
    width: 'auto',
  },
})
