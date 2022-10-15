import { randomId } from 'src/utils/utils'
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false

const Quill = ReactQuill.Quill

let BlockBlot = null

if (Quill) {
  BlockBlot = Quill.import('blots/block')
}

export class HeadingOne extends BlockBlot {
  static create() {
    const node = super.create()
    if (node.getAttribute('id')) {
      return node
    }

    node.setAttribute('id', randomId())
    return node
  }

  split(index: number, force = false) {
    if (force && (index === 0 || index >= this.length() - 1)) {
      const clone = this.clone()
      console.log('eh')
      if (!clone.domNode.id) {
        clone.domNode.id = randomId()
      }
      if (index === 0) {
        this.parent.insertBefore(clone, this)
        return this
      }
      this.parent.insertBefore(clone, this.next)
      return clone
    }

    const next = super.split(index, force)
    if (!next.domNode.id) {
      next.domNode.id = randomId()
    }
    this.cache = {}
    return next
  }
}

export class HeadingTwo extends BlockBlot {
  static create() {
    const node = super.create()
    if (node.getAttribute('id')) {
      return node
    }
    node.setAttribute('id', randomId())
    return node
  }

  split(index: number, force = false) {
    if (force && (index === 0 || index >= this.length() - 1)) {
      const clone = this.clone()
      if (!clone.domNode.id) {
        clone.domNode.id = randomId()
      }
      if (index === 0) {
        this.parent.insertBefore(clone, this)
        return this
      }
      this.parent.insertBefore(clone, this.next)
      return clone
    }

    const next = super.split(index, force)
    if (!next.domNode.id) {
      next.domNode.id = randomId()
    }
    this.cache = {}
    return next
  }
}
