import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://openclaw-pocketbase-293529-91-98-173-16316.traefik.me/')

export default pb
