# Guía de Seguridad para Credenciales

Este proyecto soporta dos métodos para manejar credenciales de MongoDB de forma segura:

## Opción 1: Variables de Entorno (Desarrollo/Testing)

### Ventajas
- Simple y rápido de configurar
- Ideal para desarrollo local
- No requiere recursos adicionales en AWS

### Cómo usarlo

1. **No incluyas** `mongodb_uri` en `terraform.tfvars`

2. Configura la variable de entorno en PowerShell:
   ```powershell
   $env:TF_VAR_mongodb_uri = "mongodb+srv://usuario:password@cluster.mongodb.net/database"
   ```

3. Ejecuta Terraform desde la misma sesión:
   ```bash
   terraform plan
   terraform apply
   ```

**Nota:** La variable de entorno solo existe en la sesión actual de PowerShell.

---

## Opción 2: AWS Secrets Manager (Producción) ⭐ Recomendado

### Ventajas
- Credenciales encriptadas en AWS
- Rotación automática de secretos
- Auditoría completa (quién accede y cuándo)
- No expone credenciales en código ni variables de entorno

### Cómo funciona

1. Terraform crea un secreto en AWS Secrets Manager
2. La instancia EC2 tiene un rol IAM que le permite leer el secreto
3. Al iniciar, la instancia obtiene la URI de MongoDB desde Secrets Manager
4. Las credenciales nunca se exponen en logs ni código

### Recursos creados

- **AWS Secrets Manager Secret**: Almacena el MongoDB URI encriptado
- **IAM Role**: Rol para la instancia EC2
- **IAM Policy**: Permite leer el secreto específico
- **IAM Instance Profile**: Asocia el rol con la instancia

### Configuración

Ya está configurado. Solo necesitas:

1. Configura `mongodb_uri` en `terraform.tfvars` o como variable de entorno
2. Ejecuta terraform:
   ```bash
   terraform plan
   terraform apply
   ```

3. Terraform automáticamente:
   - Crea el secreto en Secrets Manager
   - Configura los permisos IAM
   - La instancia EC2 obtiene las credenciales de forma segura

### Ver el secreto después del deploy

```bash
# Obtener el nombre del secreto
terraform output secrets_manager_name

# Ver el valor del secreto
aws secretsmanager get-secret-value \
    --secret-id $(terraform output -raw secrets_manager_name) \
    --region us-east-1
```

### Actualizar el secreto sin reiniciar la infraestructura

```bash
aws secretsmanager update-secret \
    --secret-id sintesis-test-dev-mongodb-uri \
    --secret-string "mongodb+srv://nuevo_usuario:nueva_password@cluster.mongodb.net/db" \
    --region us-east-1
```

**Nota:** Después de actualizar el secreto, debes reiniciar tu aplicación en la instancia EC2 para que use las nuevas credenciales.

---

## Comparación

| Característica | Variable de Entorno | AWS Secrets Manager |
|----------------|---------------------|---------------------|
| Seguridad | ⚠️ Media | ✅ Alta |
| Costo | ✅ Gratis | 💰 ~$0.40/mes |
| Configuración | ✅ Simple | ⚠️ Requiere AWS |
| Rotación | ❌ Manual | ✅ Automática |
| Auditoría | ❌ No | ✅ CloudTrail |
| Producción | ❌ No recomendado | ✅ Recomendado |

---

## Mejores Prácticas

1. **Desarrollo**: Usa variables de entorno
2. **Producción**: Usa AWS Secrets Manager
3. **Nunca** subas `terraform.tfvars` a git (ya está en `.gitignore`)
4. **Rota** las credenciales regularmente
5. **Monitorea** el acceso a secretos con CloudTrail

---

## Costos de AWS Secrets Manager

- **Almacenamiento**: $0.40/secreto/mes
- **API Calls**: $0.05 por 10,000 llamadas
- **Costo estimado mensual**: < $1 USD para este proyecto

---

## Troubleshooting

### Error: Access Denied al obtener el secreto

Verifica que el rol IAM tenga permisos:
```bash
terraform output iam_role_name
aws iam get-role --role-name $(terraform output -raw iam_role_name)
```

### La instancia no puede obtener el secreto

1. Verifica que la instancia tenga acceso a internet
2. Revisa los logs: `ssh -i sintesis-test-key.pem ubuntu@<IP>`
   ```bash
   tail -f /var/log/user-data.log
   ```

### Cambiar de variable de entorno a Secrets Manager

1. No necesitas cambiar nada en el código
2. El sistema automáticamente usa Secrets Manager si está disponible
3. La variable `use_secrets_manager = true` controla esto en `main.tf`
