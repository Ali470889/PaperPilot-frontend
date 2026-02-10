import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SelectPlanOrProductDialog from "./SelectPlanOrProductDialog";

const RecommendationSelector = ({
    plansData = [],
    productsData = [],
    refetchPlans,
    refetchProducts,
    recommendedPlanIds,
    setRecommendedPlanIds,
    recommendedProductIds,
    setRecommendedProductIds,
    setSearchPlan,
    setSearchProduct,
}) => {
    return (
        <div className="space-y-2 border p-2 rounded">
            <p>You can add recommended plans and products</p>
            <div className="flex gap-2">
                {/* Plans */}
                <div className="space-y-2 bg-muted/20 border flex-1 p-2 rounded-2xl">
                    <SelectPlanOrProductDialog
                        data={plansData}
                        actionFunction={refetchPlans}
                        recommendationIds={recommendedPlanIds}
                        setRecommendationIds={setRecommendedPlanIds}
                        setServerSearch={setSearchPlan}
                        buttonText="Add plan recommendations"
                        title="Select plan"
                        description="Select plan"
                    />
                    <div className="flex flex-wrap gap-2">
                        {recommendedPlanIds.length > 0 ? (
                            recommendedPlanIds.map((id) => {
                                const plan = plansData?.find((p) => p.id === id);
                                if (!plan) return null;
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center gap-1 rounded-md justify-between bg-muted/20 pl-2"
                                    >
                                        <span>{plan.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setRecommendedPlanIds((prev) =>
                                                    prev.filter((pid) => pid !== id)
                                                )
                                            }
                                        >
                                            <X className="text-red-400" />
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">No plan selected</p>
                        )}
                    </div>
                </div>

                {/* Products */}
                <div className="space-y-2 bg-muted/20 border flex-1 p-2 rounded-2xl">
                    <SelectPlanOrProductDialog
                        data={productsData}
                        actionFunction={refetchProducts}
                        recommendationIds={recommendedProductIds}
                        setRecommendationIds={setRecommendedProductIds}
                        setServerSearch={setSearchProduct}
                        buttonText="Add product recommendation"
                        title="Select product"
                        description="Select product"
                    />
                    <div className="flex flex-wrap gap-2">
                        {recommendedProductIds.length > 0 ? (
                            recommendedProductIds.map((id) => {
                                const product = productsData?.find((p) => p.id === id);
                                if (!product) return null;
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center gap-1 rounded-md justify-between bg-muted/20 pl-2"
                                    >
                                        <span>{product.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setRecommendedProductIds((prev) =>
                                                    prev.filter((pid) => pid !== id)
                                                )
                                            }
                                        >
                                            <X className="text-red-400" />
                                        </Button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">No product selected</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationSelector;
