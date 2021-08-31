const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const dbProductData = await Product.findAll({
      include: [
        {
          model: Category
        },
        {
          association: 'tags',
          through: {
            attributes: [],
          }
        }
      ],
    });

    res.status(200).json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const dbProductData = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category
        },
        {
          association: 'tags',
          through: {
            attributes: [],
          }
        }
      ],
    });

    res.status(200).json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": "200.00",
      "stock": "3",
      "category_id": "5",
      "tagIds": "[1, 2, 3, 4]"
    }
  */
  try {
    const dbProductData = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id
    })
    
    const tagIdArray = JSON.parse(req.body.tagIds)
    if (tagIdArray) {
      const productTagIdArr = tagIdArray.map(tagId => {
        return {
          product_id: dbProductData.id,
          tag_id: tagId,
        };
      });
      ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(dbProductData)
    
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const updateProductData = await Product.update(req.body,
      {
        where: {
          id: req.params.id
        }
      })

    const destroyTags = await ProductTag.destroy({ where: { product_id: req.params.id}})

    Promise.all([updateProductData, destroyTags]).then(() => {
      if (req.body.tagIds) {
        const tagIdArray = JSON.parse(req.body.tagIds)
        const productTagIdArr = tagIdArray.map(tagId => {
          return {
            product_id: req.params.id,
            tag_id: tagId,
          };
        });
        ProductTag.bulkCreate(productTagIdArr);
      }
      
      res.status(200).json('Update Successful')
    }).catch((err)=>{console.log(err)})

    
    } catch (err) {
      console.log(err)
      res.status(500).json.apply(err)
    }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    Product.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    )
    .then(res.status(200).json('Product Deleted'))

    ProductTag.destroy(
      {
        where: {
          product_id: req.params.id
        }
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
