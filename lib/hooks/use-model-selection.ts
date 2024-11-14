import { useLocalStorage } from './use-local-storage'
import { MODEL_PROVIDERS, type ModelProvider } from '@/lib/config/models'

export function useModelSelection() {
  const [selectedModel, setSelectedModel] = useLocalStorage<ModelProvider>(
    'selectedModel',
    'groq'
  )

  const setModel = (model: ModelProvider) => {
    if (MODEL_PROVIDERS[model]) {
      setSelectedModel(model)
    }
  }

  return {
    selectedModel,
    setModel,
    models: MODEL_PROVIDERS
  }
}
