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

lotes <- lotes[, c(3, 1, 2)]

# 12 pav.

p <- predict(fit, 
             newdata = expand.grid(AreaTotal = lotes$area, Viabilidade = 6, 
                            DataEvento = factor("Fev/2022")),
             interval = "confidence", level = .80)

p <- as.data.frame(p)

P <- exp(p)

lotes <- cbind(lotes, P)

# lotes <- lotes[order(lotes$ID), ]

Valores <- within(lotes, {
  Vmax <- area*upr
  Vmedio <- area*fit
  Vmin <- area*lwr
  Vadotado <- .9*Vmedio
  rm(ID, area, perimeter, fit, lwr, upr)
})

Valores <- st_drop_geometry(Valores)

lotes <- cbind(lotes, Valores)

write_sf(st_transform(lotes, 4326), "Lotes.geojson", delete_dsn = T)

kable(st_drop_geometry(lotes[, c("ID", "Vadotado", "Vmin", "Vmedio", "Vmax")]),
     col.names = c("ID", "Valor Adotado", "Valor Mínimo", "Valor Mediano", "Valor Máximo"),
     digits = 0, format.args = list(big.mark = ".", decimal.mark = ',')
    )

sum(lotes$Vadotado)
