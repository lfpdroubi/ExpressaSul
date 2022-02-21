# Avaliação Via Expressa Sul
# 

library(readxl)
library(effects)
library(car)
library(sf)
library(kableExtra)

amostra <- 
  read_excel("Laudo/dados.xls", 
             sheet = "Dados", range = "B2:J62", 
             col_types = c("text", "text", "text", "text", "text", "numeric", 
                           "numeric", "numeric", "numeric"))
amostra <- within(amostra, {
  DataEvento <- factor(DataEvento,
                       labels = c("Out/2015", "Nov/2016", "Fev/2017",
                                  "Mai/2018", "Dez/2018", "Fev/2022"))
  VU <- ValorTotal/AreaTotal
  # DataEvento <- relevel(DataEvento, 5)
})

fit <- lm(log(VU) ~ sqrt(AreaTotal) + log(Viabilidade) + DataEvento, 
          data = amostra )
s <- summary(fit)

plot(predictorEffects(fit, residuals = T),
     axes=list(x=list(rotate=30))
)

plot(predictorEffects(fit),
     axes=list(y=list(transform=exp, lab="Valor Unitário"),
               x=list(rotate=30))
)

lotes <- read_sf("Lotes.geojson")

# 12 pav.

p <- predict(fit, 
             newdata = expand.grid(AreaTotal = lotes$area, Viabilidade = 9, 
                            DataEvento = factor("Fev/2022")),
             interval = "confidence", level = .80)

p <- as.data.frame(p)

P <- exp(p)

lotes <- cbind(lotes, P)

lotes <- lotes[order(lotes$ID), ]

lotes <- within(lotes, {
  Vmin <- area*lwr
  Vmedio <- area*fit
  Vmax <- area*upr
})

lotes <- lotes[, c(1:6, 9, 8, 7, 10)]

write_sf(st_transform(lotes, 4326), "LotesMod.geojson", delete_dsn = T)

# Média do Valor Unitário dos lotes

exp(p$fit)

mean(exp(p$fit))

# Valor Total dos lotes

sum(exp(p$fit)*lotes$area)

# 6 pav.

p <- predict(fit, 
             newdata = expand.grid(AreaTotal = lotes$area, Viabilidade = 6, 
                                   DataEvento = factor("Fev/2022")),
             interval = "confidence", level = .80)

p <- as.data.frame(p)

# Média do Valor Unitário dos lotes

exp(p$fit)

mean(exp(p$fit))

# Valor Total dos lotes

sum(exp(p$fit)*lotes$area)

kable(st_drop_geometry(lotes[, c("ID", "fit", "lwr", "upr", "Vmedio", "Vmin", "Vmax")]),
     col.names = c("ID", "VU médio", "VU mínimo", "VU Máximo", "VT médio", 
                    "VT mínimo", "VT máximo"),
     digits = 0, format.args = list(big.mark = ".", decimal.mark = ',')
    )
