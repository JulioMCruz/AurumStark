## Provider: rewardProvider

El provider principal para interactuar con el contrato AurumReward.

### Método Principal

| Método | Descripción | Parámetros | Retorno |
|--------|-------------|------------|----------|
| claimReward | Reclama tokens ERC20 como recompensa | amount: string, tokenAddress: string | { success: boolean, transactionHash?: string, message?: string, error?: string } |

## Acciones

### claimReward

```typescript
// Ejemplo de uso de la acción
const result = await agent.execute("claimReward", {
    amount: "1000000000000000000",
    tokenAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
});
```

#### Parámetros

| Nombre | Tipo | Descripción | Requerido |
|--------|------|-------------|-----------|
| amount | string | Cantidad de tokens a reclamar | Sí |
| tokenAddress | string | Dirección del token ERC20 | Sí |

## Desarrollo 