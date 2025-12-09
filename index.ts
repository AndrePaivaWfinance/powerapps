import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class FinanceDashboard implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ) {
        this.container = container;
        this.render(context);
    }

    private render(context: ComponentFramework.Context<IInputs>) {

        const saldo = context.parameters.Saldo.raw || 0;
        const receita = context.parameters.Receita.raw || 0;
        const despesa = context.parameters.Despesa.raw || 0;

        this.container.innerHTML = `
            <div class="dashboard">
                
                <div class="topbar">
                    <div class="logo">WFinance</div>
                    <div class="saldo">R$ ${saldo.toLocaleString()}</div>
                </div>

                <div class="cards">
                    <div class="card green">
                        <h3>Receitas</h3>
                        <p>R$ ${receita.toLocaleString()}</p>
                    </div>

                    <div class="card red">
                        <h3>Despesas</h3>
                        <p>R$ ${despesa.toLocaleString()}</p>
                    </div>

                    <div class="card blue">
                        <h3>Resultado</h3>
                        <p>R$ ${(receita - despesa).toLocaleString()}</p>
                    </div>
                </div>

                <div class="grafico">
                    <canvas id="fluxoCanvas"></canvas>
                </div>
            </div>
        `;

        this.renderChart(receita, despesa);
    }

    private renderChart(receita: number, despesa: number) {
        const canvas = document.getElementById("fluxoCanvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        new (window as any).Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Receita", "Despesa"],
                datasets: [{
                    data: [receita, despesa]
                }]
            }
        });
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.render(context);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {}
}
