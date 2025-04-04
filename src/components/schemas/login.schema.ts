import { z } from 'zod';
import { validateDni } from '../../utils/validate-dni';



export const getLoginSchema = (t: (key: string, params?: Record<string, any>) => string) => 
    z.object({
        dni: z.string().refine(validateDni, { message: t("validation.dni") }),
        password: z.string().min(6, { message: t("validation.password", { minimoContrasena: 6 }) })
    })


export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;