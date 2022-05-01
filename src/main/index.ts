import './config/module-alias'
import 'reflect-metadata'

import { app } from '@/main/config/app'

app.listen(8080, () => console.log('Server running at http://localhost:8080'))
