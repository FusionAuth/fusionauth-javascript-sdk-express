const config = require('./config')

const fusionAuthClient = async (endpoint, options) => {  
  try {
    const url = config.fusionAuthBaseUrl + endpoint
    const rawResponse = await fetch(url, options)

    if (!rawResponse.ok) {
      throw new Error({
        message: await rawResponse.text()
      })
    }

    const parsedResponse = await parseResponse(rawResponse)
    return parsedResponse
  } catch (error) {
    throw error
  }
}

const parseResponse = async (response) => {
  let parsed;

  try {
    parsed = await response.json()
  } catch {
    parsed = await response.text()
  }

  return parsed
}

const getFormURLEncodedPayload = (requestBody) => {
  let encoded = []

  for(key in requestBody) {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(requestBody[key])
    encoded.push(`${encodedKey}=${encodedValue}`)
  }
  
  return encoded.join('&')
}

module.exports = { fusionAuthClient, getFormURLEncodedPayload }
