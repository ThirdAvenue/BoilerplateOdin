const product = {
    id: "model",
    version: 1.0,
    product: 'DemoProduct',
    module: {
        model: 'S3',
        rotation: Math.PI,
        position: { x: 0, y: 0, z: 0 },
        id: "model",
        version: 1.0,
    },
    connectors: [
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
        {
            model: 'Blank',
            rotation: Math.PI,
            id: "model",
            version: 1.0,
        },
    ],
}

export function translator(data: any) {
    const taken = [] // all spots already taken

    if (data.product.optionConfigurations.Link[0].Quantity === 1) {
        product.connectors[0].model = 'Link'
        taken.push(0)
    }
    //VPU
    if (
        data.product.optionConfigurations[
            'Layers (Qty 1 Equivalent to 4 Layers, Qty 2 Equivalent to 8 Layers)'
        ][0].selected === true
    ) {
        if (
            data.product.optionConfigurations[
                'Layers (Qty 1 Equivalent to 4 Layers, Qty 2 Equivalent to 8 Layers)'
            ][0].Quantity === 1
        ) {
            product.connectors[1].model = 'VPU'
            taken.push(1)
        } else if (
            data.product.optionConfigurations[
                'Layers (Qty 1 Equivalent to 4 Layers, Qty 2 Equivalent to 8 Layers)'
            ][0].Quantity === 2
        ) {
            product.connectors[1].model = 'VPU'
            product.connectors[2].model = 'VPU'
            taken.push(1)
            taken.push(2)
        }
    }

    //inputs
    if (data.product.optionConfigurations['Non Configurable Input Cards'][0].selected === true) {
        for (
            let i = 0;
            i < data.product.optionConfigurations['Non Configurable Input Cards'][0].Quantity;
            i++
        ) {
            product.connectors[5 - i].model = 'TriInput'
            taken.push(5 - i)
        }
    }
    if (data.product.optionConfigurations['Non Configurable Input Cards'][1].selected === true) {
        for (
            let i = 0;
            i < data.product.optionConfigurations['Non Configurable Input Cards'][1].Quantity;
            i++
        ) {
            if (!taken.includes(5 - i)) {
                product.connectors[5 - i].model = 'QuadHDMIIn'
                taken.push(5 - i)
            } else if (!taken.includes(5 - i - 1)) {
                product.connectors[5 - i - 1].model = 'QuadHDMIIn'
                taken.push(5 - i + 1)
            } else {
                product.connectors[5 - i - 2].model = 'QuadHDMIIn'
                taken.push(5 - i + 2)
            }
        }
    }

    //outputs
    if (data.product.optionConfigurations.Outputs[0].selected === true) {
        for (let i = 0; i < data.product.optionConfigurations.Outputs[0].Quantity; i++) {
            product.connectors[8 - i].model = 'DP12Out'
            taken.push(8 - i)
        }
    }
    if (data.product.optionConfigurations.Outputs[1].selected === true) {
        for (let i = 0; i < data.product.optionConfigurations.Outputs[1].Quantity; i++) {
            if (!taken.includes(8 - i)) {
                product.connectors[8 - i].model = 'TriOutput'
                taken.push(8 - i)
            } else if (!taken.includes(8 - i - 1)) {
                product.connectors[8 - i - 1].model = 'TriOutput'
                taken.push(8 - i - 1)
            } else {
                product.connectors[8 - i - 2].model = 'TriOutput'
                taken.push(8 - i - 2)
            }
        }
    }
    if (data.product.optionConfigurations.Outputs[2].selected === true) {
        for (let i = 0; i < data.product.optionConfigurations.Outputs[2].Quantity; i++) {
            if (!taken.includes(8 - i)) {
                product.connectors[8 - i].model = 'QuadHDMIOut'
                taken.push(8 - i)
            } else if (!taken.includes(8 - i - 1)) {
                product.connectors[8 - i - 1].model = 'QuadHDMIOut'
                taken.push(8 - i - 1)
            } else {
                product.connectors[8 - i - 2].model = 'QuadHDMIOut'
                taken.push(8 - i - 2)
            }
        }
    }
    

    return product
}
