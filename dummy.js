 {
    orders: [
        {
            products: [
                {
                    _
                },
                {
                    _id: "625fa5a8b3c2c5a3c744d5b03",
                    name: "Product 2",
                    price: 20000,
                    quantity: 1
                }
            ],
            paymen: {
                method: "midtrans",
                status: "success"
            },
            buyer: {
                _id: "625fa5a8b3c2c5a3c744d5b01",
                name: "John Doe",
                email: "johndoe@example.com"
            },
            status: "Procesing",
            createdAt: "2022-05-11T02:53:15.000Z",
            updatedAt: "2022-05-11T02:53:15.000Z"
        },
        {
            _id: "627a5a8b3c2c5a3c744d5b13",
            products: [
                {
                    _id: "625fa5a8b3c2c5a3c744d5b02",
                    name: "Product 1",
                    price: 10000,
                    quantity: 1
                }
            ],
            paymen: {
                method: "midtrans",
                status: "pending"
            },
            buyer: {
                _id: "625fa5a8b3c2c5a3c744d5b01",
                name: "John Doe",
                email: "johndoe@example.com"
            },
            status: "Not Process",
            createdAt: "2022-05-11T02:53:15.000Z",
            updatedAt: "2022-05-11T02:53:15.000Z"
        }
    ]
}
