import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"

export const addProduct = async (req, res) => {
  try {

    let {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller
    } = req.body

    let image1 = await uploadOnCloudinary(req.files.image1[0].path)
    let image2 = await uploadOnCloudinary(req.files.image2[0].path)
    let image3 = await uploadOnCloudinary(req.files.image3[0].path)
    let image4 = await uploadOnCloudinary(req.files.image4[0].path)

    let productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4
    }

    const product = await Product.create(productData)

    return res.status(201).json(product)

  }catch (error) {

  console.log("FULL ERROR:", error)

  return res.status(500).json({
    success: false,
    message: error.message
  })
}
}

export const listProduct = async (req, res) => {
  try {

    const products = await Product.find()

    return res.status(200).json(products)

  } catch (error) {

    console.log("ListProduct error")

    return res.status(500).json({
      message: `ListProduct error ${error}`
    })
  }
}

export const removeProduct = async (req, res) => {
  try {

    const { id } = req.body

    await Product.findByIdAndDelete(id)

    return res.status(200).json({
      message: "Product removed successfully"
    })

  } catch (error) {

    console.log("RemoveProduct error")

    return res.status(500).json({
      message: `RemoveProduct error ${error}`
    })
  }
}
