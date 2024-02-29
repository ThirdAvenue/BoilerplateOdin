import { OdinConfigurator } from '..'
import { product } from '../../product/productX'

export function apiCall(product: product) {
    const taken: number[] = [] // all spots already taken
    fetch('../S3Demo/Assets/configuration1.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText)
            }
            return response.json()
        })
        .then((data) => {
            
            console.log(data)
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error)
            return product
        })
    return product
}
