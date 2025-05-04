import {defineConfig} from 'sanity';
import { structureTool } from 'sanity/structure';
import schemas from './sanity/schemas';

const config = defineConfig({
    projectId: '1dh12c74',
    dataset: 'production',
    title: 'CMS for Flick using sanity',
    apiVersion: '2025-03-04',
    basePath: "/admin",
    token: process.env.SANITY_API_TOKEN,
    plugins: [structureTool()],
    schema: {types: schemas},
    
})

export default config;