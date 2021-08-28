const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const dbTagData = await Tag.findAll({
      include: [
        {
          association: 'products',
          through: {
            attributes: []
          }
        }
      ]
    })

    res.status(200).json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const dbTagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          association: 'products',
          through: {
            attributes: []
          }
        }
      ]
    })

    res.status(200).json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const dbTagData = await Tag.create({
      tag_name: req.body.tag_name
    })

    res.status(200).json(dbTagData)
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    Tag.update(
      { tag_name: req.body.tag_name},
      {
        where: {
          id: req.params.id
        }
      }
    )
    .then(res.status(200).json('Update Successful'));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    Tag.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    )
    .then(res.status(200).json('Tag Deleted'));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
